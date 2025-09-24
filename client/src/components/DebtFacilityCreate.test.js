// ************************************************************************
// *     UT-4 – Populating search options for Bank Name from API call     *
// *     UT-5 – Populating search options for Portfolio from API call     *
// *     UT-8 - Testing PUT API Call After Filling in Data from Form      *
// ************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import DebtFacilityCreate from "./DebtFacilityCreate";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();

});

test("UT-4 – Populating search options for Bank Name from API call", async () => {

// Since there are two separate API's GETs being called in DebtFacilityCreate
// axios.get.mockImplementation(url) allows us to specify what to return based on
// the path of the url.  In this case, /lenderquery returns lender data and 
// /facilityquery returns facility data.  

axios.get.mockImplementation((url) => {
  if (url.includes("lenderquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        lender_name: "Oak Bank",
        lender_id: "100",
      },
      {
        lender_name: "Poplar Bank",
        lender_id: "101",
      },
      {
        lender_name: "Cherry Blossom Bank",
        lender_id: "102",
      },
    ],
  });
}

  if (url.includes("portfolioquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        portfolio_name: "Fund Apple",
        portfolio_id: "1",
      },
      {
        portfolio_name: "Fund Banana",
        portfolio_id: "2",
      },
    ],
  });
}

});

  render(<DebtFacilityCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/lenderquery",
    );
  });

  const lenderName = screen.getByLabelText("Lender Name");

  fireEvent.mouseDown(lenderName);

  expect(screen.getByText("Cherry Blossom Bank")).toBeInTheDocument();
});


test("UT-5 – Populating search options for Portfolio from API call", async () => {
  
// Since there are two separate API's GETs being called in DebtFacilityCreate
// axios.get.mockImplementation(url) allows us to specify what to return based on
// the path of the url.  In this case, /lenderquery returns lender data and 
// /facilityquery returns facility data.

axios.get.mockImplementation((url) => {
  if (url.includes("lenderquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        lender_name: "Oak Bank",
        lender_id: "100",
      },
      {
        lender_name: "Poplar Bank",
        lender_id: "101",
      },
      {
        lender_name: "Cherry Blossom Bank",
        lender_id: "102",
      },
    ],
  });
}

  if (url.includes("portfolioquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        portfolio_name: "Fund Apple",
        portfolio_id: "1",
      },
      {
        portfolio_name: "Fund Banana",
        portfolio_id: "2",
      },
    ],
  });
}

});

  render(<DebtFacilityCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/portfolioquery",
    );
  });

  const portfolioName = screen.getByLabelText("Portfolio Name");

  fireEvent.mouseDown(portfolioName);

  expect(screen.getByText("Fund Banana")).toBeInTheDocument();
});


test("UT-8 - Testing PUT API Call After Filling in Data from Form", async () => {


// Since there are two separate API's GETs being called in DebtFacilityCreate
// axios.get.mockImplementation(url) allows us to specify what to return based on
// the path of the url.  In this case, /lenderquery returns lender data and 
// /facilityquery returns facility data.

axios.get.mockImplementation((url) => {
  if (url.includes("lenderquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        lender_name: "Oak Bank",
        lender_id: "100",
      },
      {
        lender_name: "Poplar Bank",
        lender_id: "101",
      },
      {
        lender_name: "Cherry Blossom Bank",
        lender_id: "102",
      },
    ],
  });
}

  if (url.includes("portfolioquery")) {  
  
  return Promise.resolve ({
  data: [
      {
        portfolio_name: "Fund Apple",
        portfolio_id: "1",
      },
      {
        portfolio_name: "Fund Banana",
        portfolio_id: "2",
      },
    ],
  });
}

});

  render(<DebtFacilityCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/lenderquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/portfolioquery",
    );
  });


  // Find Facility name input box and input text
  const facilityNameInput = screen.getByLabelText("Facility Name *");
  fireEvent.change(facilityNameInput, { target: { value: "Mario Kart Facility" } });
  expect(facilityNameInput.value).toBe("Mario Kart Facility");

 // Find autocomplete box for lender name and select lender
  const lenderAutocomplete = screen.getByLabelText("Lender Name");
  fireEvent.mouseDown(lenderAutocomplete);
  fireEvent.click(screen.getByText("Cherry Blossom Bank"));
  expect(lenderAutocomplete.value).toBe("Cherry Blossom Bank");

  // Find autocomplete box for portfolio name and select portfolio
  const portfolioAutocomplete = screen.getByLabelText("Portfolio Name");
  fireEvent.mouseDown(portfolioAutocomplete);
  fireEvent.click(screen.getByText("Fund Banana"));
  expect(portfolioAutocomplete.value).toBe("Fund Banana");

  
  // Find autocomplete box for commitment date input and enter date
  // Note that we had to specify "input" because React renders the words Commitment Date (including
  // a hidden input, so it doesn't know which to select without the selector)

  const commitmentDateInput = screen.getByLabelText("Commitment Date", {selector: 'input'});
  fireEvent.change(commitmentDateInput, { target: { value: "01/02/2025"}});

  // Find autocomplete box for Maturity Date input and enter date
  // Note that we had to specify "input" because React renders the words Maturity Date (including
  // a hidden input, so it doesn't know which to select without the selector)
  const maturityDateInput = screen.getByLabelText("Maturity Date", {selector: 'input'});
  fireEvent.change(maturityDateInput, { target: { value: "01/02/2030"}});

  // Find Commitment Amount input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const commitmentAmountInput = screen.getByLabelText("Commitment Amount *");
  fireEvent.change(commitmentAmountInput, { target: { value: "100000000" } });
  expect(commitmentAmountInput.value).toBe("$100,000,000.00");

  // Find Toggle for Overall Rate and click
  const toggleOverallRate = screen.getByLabelText("Overall Rate");
  fireEvent.click(toggleOverallRate);
  expect(toggleOverallRate).toBeChecked();

  // Find Overall Rate input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const overallAdvanceRateInput = screen.getByLabelText("Overall Advance Rate");
  fireEvent.change(overallAdvanceRateInput, { target: { value: "65" } });
  expect(overallAdvanceRateInput.value).toBe("65.000000%");

  // Find Toggle for Asset By Asset Rate and click
  const toggleAssetByAssetRate = screen.getByLabelText("Asset By Asset Rate");
  fireEvent.click(toggleAssetByAssetRate);
  expect(toggleAssetByAssetRate).toBeChecked();

  // Find First Lien Rate input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const firstLienRateInput = screen.getByLabelText("First Lien Rate");
  fireEvent.change(firstLienRateInput, { target: { value: "70" } });
  expect(firstLienRateInput.value).toBe("70.000000%");

  // Find Second Lien Rate input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const secondLienRateInput = screen.getByLabelText("Second Lien Rate");
  fireEvent.change(secondLienRateInput, { target: { value: "45" } });
  expect(secondLienRateInput.value).toBe("45.000000%");

  // Find Mezzanine Rate input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const mezzanineRateInput = screen.getByLabelText("Mezzanine Rate");
  fireEvent.change(mezzanineRateInput, { target: { value: "30" } });
  expect(mezzanineRateInput.value).toBe("30.000000%");

  // Find Toggle for Minimum Equity Requirement and click
  const toggleMinEquity = screen.getByLabelText("Minimum Equity");
  fireEvent.click(toggleMinEquity);
  expect(toggleMinEquity).toBeChecked();

  // Find Mezzanine Rate input box and input text.  Note the text is auto formatted so our
  // expect assertion needs to be as well.
  const minimumEquityAmountInput = screen.getByLabelText("Minimum Equity Amount");
  fireEvent.change(minimumEquityAmountInput, { target: { value: "5000000" } });
  expect(minimumEquityAmountInput.value).toBe("$5,000,000.00");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce();
  
  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createdebtfacility"),
      expect.objectContaining({
        debtFacilityName: "Mario Kart Facility",
        portfolioId: "2",
        lenderId: "102",
        startDate: "2025-01-02",
        endDate: "2030-01-02",
        overAllCommitmentAmount: 100000000,
        isOverallRate: true,
        overallRate: 0.65,
        isAssetByAssetAdvance: true,
        firstLienRate: 0.70,
        secondLienRate: 0.45,
        mezzRate: 0.30,
        isMinEquity: true,
        minEquityAmount: 5000000,
      })
  );
}
);
});