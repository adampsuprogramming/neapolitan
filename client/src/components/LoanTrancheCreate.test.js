// ******************************************************************************************************************************************************
// *     UT-33 – Populating search options for Borrower Name from API call                                                                              *
// *     UT-34 – Populating search options for Loan Agreement from API call                                                                             *
// *     UT-35 - Testing PUT API Call After Filling in Data from Form (Floating Rate)                                                                   *
// *     UT-36 - Test to ensure autocomplete works if there is a borrower with a null name and a borrower a null borrower_id                            *
// *     UT-37 - Test to ensure autocomplete works if there is one loan agreement with a null name and a loan agreement with a null loan_agreement_id.  *
// *     UT-38 - Testing PUT API Call After Filling in Data from Form (Fixed Rate)                                                                      *
// ******************************************************************************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import DebtFacilityCreate from "./DebtFacilityCreate";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoanTrancheCreate from "./LoanTrancheCreate";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-33 – Populating search options for Borrower Name from API call", async () => {
  // There are multiple API gets --- the below sends mock data base on which path is called (i.e. borrowerquery or loanagreementquery)
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "The Zelda Company",
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
            borrower_id: "10002",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  const borrowerName = screen.getByLabelText("Borrower Name");

  fireEvent.mouseDown(borrowerName);

  expect(screen.getByText("The Link Company")).toBeInTheDocument();
});

test("UT-34 – Populating search options for Loan Agreement from API call", async () => {
  // There are multiple API gets --- the below sends mock data base on which path is called (i.e. borrowerquery or loanagreementquery)

  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "The Zelda Company",
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
            borrower_id: "10002",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            loan_agreement_id: "555",
            borrower_id: "10000",
            loan_agreement_date: "2025-05-05T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with Zelda Co.",
            legal_name: "The Zelda Company",
          },
          {
            loan_agreement_id: "556",
            borrower_id: "10001",
            loan_agreement_date: "2025-04-10T05:00:00.000Z",
            loan_agreement_name: "Term Loan B Facility with Link Co.",
            legal_name: "The Link Company",
          },
          {
            loan_agreement_id: "557",
            borrower_id: "10002",
            loan_agreement_date: "2025-09-15T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with The Triforce Co.",
            legal_name: "The Triforce Company",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);
  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanagreementquery",
    );
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("The Triforce Company"));

  const loanAgreementName = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementName);
  expect(
    screen.getByText("Term Loan A Facility with The Triforce Co."),
  ).toBeInTheDocument();
});

test("UT-35 - Testing PUT API Call After Filling in Data from Form (Floating Rate)", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "The Zelda Company",
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
            borrower_id: "10002",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            loan_agreement_id: "555",
            borrower_id: "10000",
            loan_agreement_date: "2025-05-05T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with Zelda Co.",
            legal_name: "The Zelda Company",
          },
          {
            loan_agreement_id: "556",
            borrower_id: "10001",
            loan_agreement_date: "2025-04-10T05:00:00.000Z",
            loan_agreement_name: "Term Loan B Facility with Link Co.",
            legal_name: "The Link Company",
          },
          {
            loan_agreement_id: "557",
            borrower_id: "10002",
            loan_agreement_date: "2025-09-15T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with The Triforce Co.",
            legal_name: "The Triforce Company",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanagreementquery",
    );
  });

  // Find Loan Tranche name input box and input text
  const loanTrancheNameInput = screen.getByLabelText("Loan Tranche Name *");
  fireEvent.change(loanTrancheNameInput, {
    target: { value: "Senior Term Loan - The Link Co." },
  });
  expect(loanTrancheNameInput.value).toBe("Senior Term Loan - The Link Co.");

  // Find autocomplete box for borrower name and select borower name
  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("The Link Company"));
  expect(borrowerAutoComplete.value).toBe("The Link Company");

  // Find autocomplete box for loan agreement name and select loan agreement
  const loanAgreementAutocomplete = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementAutocomplete);
  fireEvent.click(screen.getByText("Term Loan B Facility with Link Co."));
  expect(loanAgreementAutocomplete.value).toBe(
    "Term Loan B Facility with Link Co.",
  );

  // Find autocomplete box for Tranche Type and make selection
  const trancheTypeAutocomplete = screen.getByLabelText("Tranche Type");
  fireEvent.mouseDown(trancheTypeAutocomplete);
  fireEvent.click(screen.getByText("Term"));
  expect(trancheTypeAutocomplete.value).toBe("Term");

  // Find autocomplete box for Lien Type and make selection
  const lienTypeAutocomplete = screen.getByLabelText("Lien Type");
  fireEvent.mouseDown(lienTypeAutocomplete);
  fireEvent.click(screen.getByText("First Lien"));
  expect(lienTypeAutocomplete.value).toBe("First Lien");

  // Find autocomplete box for tranche start date input and enter date
  const startDateInput = screen.getByLabelText("Tranche Start Date", {
    selector: "input",
  });
  fireEvent.change(startDateInput, { target: { value: "10/31/2025" } });
  expect(startDateInput.value).toBe("10/31/2025");

  // Find autocomplete box for tranche maturity date input and enter date
  const maturityDateInput = screen.getByLabelText("Tranche Maturity Date", {
    selector: "input",
  });
  fireEvent.change(maturityDateInput, { target: { value: "10/31/2030" } });
  expect(maturityDateInput.value).toBe("10/31/2030");

  // Find EBITDA(LTM) input box and input text
  const ebitdaInput = screen.getByLabelText("EBITDA (LTM)");
  fireEvent.change(ebitdaInput, {
    target: { value: "45000000" },
  });
  expect(ebitdaInput.value).toBe("$45,000,000.00");

  // Find Leverage Ratio input box and input text
  const levRatioInput = screen.getByLabelText("Leverage Ratio");
  fireEvent.change(levRatioInput, {
    target: { value: "5.4015" },
  });
  expect(levRatioInput.value).toBe("5.401500");

  // Find Net Leverage Ratio input box and input text
  const netLevRatioInput = screen.getByLabelText("Net Leverage Ratio");
  fireEvent.change(netLevRatioInput, {
    target: { value: "5.1108" },
  });
  expect(netLevRatioInput.value).toBe("5.110800");

  // Find Interest Coverage Ratio input box and input text
  const intCovInput = screen.getByLabelText("Interest Coverage Ratio");
  fireEvent.change(intCovInput, {
    target: { value: "2.4" },
  });
  expect(intCovInput.value).toBe("2.400000");

  // Find autocomplete box for Rate Type and make selection
  const rateTypeAutocomplete = screen.getByLabelText("Rate Type");
  fireEvent.mouseDown(rateTypeAutocomplete);
  fireEvent.click(screen.getByText("Floating Rate"));
  expect(rateTypeAutocomplete.value).toBe("Floating Rate");

  // Find Spread input box and input text
  const spreadInput = screen.getByLabelText("Spread");
  fireEvent.change(spreadInput, {
    target: { value: "5.9" },
  });
  expect(spreadInput.value).toBe("5.900000%");

  // Find Floor input box and input text
  const floorInput = screen.getByLabelText("Floor");
  fireEvent.change(floorInput, {
    target: { value: "2.55" },
  });
  expect(floorInput.value).toBe("2.550000%");

  // Find autocomplete box for Reference Rate and make selection
  const refRateAutocomplete = screen.getByLabelText("Reference Rate");
  fireEvent.mouseDown(refRateAutocomplete);
  fireEvent.click(screen.getByText("LIBOR"));
  expect(refRateAutocomplete.value).toBe("LIBOR");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createloantranche"),
      expect.objectContaining({
        loanTrancheName: "Senior Term Loan - The Link Co.",
        loanAgreementId: "556",
        trancheType: "Term",
        lienType: "First Lien",
        trancheStart: "2025-10-31",
        trancheMaturity: "2030-10-31",
        ebitda: 45000000,
        leverageRatio: 5.4015,
        netLeverageRatio: 5.1108,
        interestCoverage: 2.4,
        rateType: "Floating Rate",
        fixedRate: null,
        spread: 0.059,
        floor: 0.0255,
        refRate: "LIBOR",
      }),
    );
  });

  // simulate cancel click
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(loanTrancheNameInput.value).toBe("");
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementAutocomplete.value).toBe("");
  expect(trancheTypeAutocomplete.value).toBe("");
  expect(lienTypeAutocomplete).not.toBeChecked();
  expect(startDateInput.value).toBe("");
  expect(maturityDateInput).not.toBeChecked();
  expect(ebitdaInput.value).toBe("");
  expect(levRatioInput.value).toBe("");
  expect(netLevRatioInput.value).toBe("");
  expect(intCovInput).not.toBeChecked();
  expect(rateTypeAutocomplete.value).toBe("");
  expect(spreadInput.value).toBe("");
  expect(floorInput.value).toBe("");
  expect(refRateAutocomplete.value).toBe("");
});

test("UT-36 – Test to ensure autocomplete works if there is a borrower with a null name and a borrower a null borrower_id", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  const borrowerName = screen.getByLabelText("Borrower Name");

  fireEvent.mouseDown(borrowerName);

  expect(screen.getByText("The Link Company")).toBeInTheDocument();
});

test("UT-37 – Test to ensure autocomplete works if there is one loan agreement with a null name and a loan agreement with a null loan_agreement_id.", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "The Zelda Company",
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
            borrower_id: "10002",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            borrower_id: "10000",
            loan_agreement_date: "2025-05-05T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with Zelda Co.",
            legal_name: "The Zelda Company",
          },
          {
            loan_agreement_id: "556",
            borrower_id: "10001",
            loan_agreement_date: "2025-04-10T05:00:00.000Z",
            legal_name: "The Link Company",
          },
          {
            loan_agreement_id: "557",
            borrower_id: "10002",
            loan_agreement_date: "2025-09-15T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with The Triforce Co.",
            legal_name: "The Triforce Company",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);
  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanagreementquery",
    );
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("The Triforce Company"));

  const loanAgreementName = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementName);
  expect(
    screen.getByText("Term Loan A Facility with The Triforce Co."),
  ).toBeInTheDocument();
});

test("UT-38 - Testing PUT API Call After Filling in Data from Form (Fixed Rate)", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "The Zelda Company",
            borrower_id: "10000",
          },
          {
            legal_name: "The Link Company",
            borrower_id: "10001",
          },
          {
            legal_name: "The Triforce Company",
            borrower_id: "10002",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            loan_agreement_id: "555",
            borrower_id: "10000",
            loan_agreement_date: "2025-05-05T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with Zelda Co.",
            legal_name: "The Zelda Company",
          },
          {
            loan_agreement_id: "556",
            borrower_id: "10001",
            loan_agreement_date: "2025-04-10T05:00:00.000Z",
            loan_agreement_name: "Term Loan B Facility with Link Co.",
            legal_name: "The Link Company",
          },
          {
            loan_agreement_id: "557",
            borrower_id: "10002",
            loan_agreement_date: "2025-09-15T05:00:00.000Z",
            loan_agreement_name: "Term Loan A Facility with The Triforce Co.",
            legal_name: "The Triforce Company",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanTrancheCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanagreementquery",
    );
  });

  // Find Loan Tranche name input box and input text
  const loanTrancheNameInput = screen.getByLabelText("Loan Tranche Name *");
  fireEvent.change(loanTrancheNameInput, {
    target: { value: "Senior Term Loan - The Link Co." },
  });
  expect(loanTrancheNameInput.value).toBe("Senior Term Loan - The Link Co.");

  // Find autocomplete box for borrower name and select borower name
  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("The Link Company"));
  expect(borrowerAutoComplete.value).toBe("The Link Company");

  // Find autocomplete box for loan agreement name and select loan agreement
  const loanAgreementAutocomplete = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementAutocomplete);
  fireEvent.click(screen.getByText("Term Loan B Facility with Link Co."));
  expect(loanAgreementAutocomplete.value).toBe(
    "Term Loan B Facility with Link Co.",
  );

  // Find autocomplete box for Tranche Type and make selection
  const trancheTypeAutocomplete = screen.getByLabelText("Tranche Type");
  fireEvent.mouseDown(trancheTypeAutocomplete);
  fireEvent.click(screen.getByText("Term"));
  expect(trancheTypeAutocomplete.value).toBe("Term");

  // Find autocomplete box for Lien Type and make selection
  const lienTypeAutocomplete = screen.getByLabelText("Lien Type");
  fireEvent.mouseDown(lienTypeAutocomplete);
  fireEvent.click(screen.getByText("First Lien"));
  expect(lienTypeAutocomplete.value).toBe("First Lien");

  // Find autocomplete box for tranche start date input and enter date
  const startDateInput = screen.getByLabelText("Tranche Start Date", {
    selector: "input",
  });
  fireEvent.change(startDateInput, { target: { value: "10/31/2025" } });
  expect(startDateInput.value).toBe("10/31/2025");

  // Find autocomplete box for tranche maturity date input and enter date
  const maturityDateInput = screen.getByLabelText("Tranche Maturity Date", {
    selector: "input",
  });
  fireEvent.change(maturityDateInput, { target: { value: "10/31/2030" } });
  expect(maturityDateInput.value).toBe("10/31/2030");

  // Find EBITDA(LTM) input box and input text
  const ebitdaInput = screen.getByLabelText("EBITDA (LTM)");
  fireEvent.change(ebitdaInput, {
    target: { value: "45000000" },
  });
  expect(ebitdaInput.value).toBe("$45,000,000.00");

  // Find Leverage Ratio input box and input text
  const levRatioInput = screen.getByLabelText("Leverage Ratio");
  fireEvent.change(levRatioInput, {
    target: { value: "5.4015" },
  });
  expect(levRatioInput.value).toBe("5.401500");

  // Find Net Leverage Ratio input box and input text
  const netLevRatioInput = screen.getByLabelText("Net Leverage Ratio");
  fireEvent.change(netLevRatioInput, {
    target: { value: "5.1108" },
  });
  expect(netLevRatioInput.value).toBe("5.110800");

  // Find Interest Coverage Ratio input box and input text
  const intCovInput = screen.getByLabelText("Interest Coverage Ratio");
  fireEvent.change(intCovInput, {
    target: { value: "2.4" },
  });
  expect(intCovInput.value).toBe("2.400000");

  // Find autocomplete box for Rate Type and make selection
  const rateTypeAutocomplete = screen.getByLabelText("Rate Type");
  fireEvent.mouseDown(rateTypeAutocomplete);
  fireEvent.click(screen.getByText("Fixed Rate"));
  expect(rateTypeAutocomplete.value).toBe("Fixed Rate");

  // Find Fixed Rate input box and input text
  const fixedInput = screen.getByLabelText("Fixed Coupon");
  fireEvent.change(fixedInput, {
    target: { value: "8.9" },
  });
  expect(fixedInput.value).toBe("8.900000%");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createloantranche"),
      expect.objectContaining({
        loanTrancheName: "Senior Term Loan - The Link Co.",
        loanAgreementId: "556",
        trancheType: "Term",
        lienType: "First Lien",
        trancheStart: "2025-10-31",
        trancheMaturity: "2030-10-31",
        ebitda: 45000000,
        leverageRatio: 5.4015,
        netLeverageRatio: 5.1108,
        interestCoverage: 2.4,
        rateType: "Fixed Rate",
        fixedRate: 0.089,
        spread: null,
        floor: null,
        refRate: null,
      }),
    );
  });

  // simulate cancel click
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(loanTrancheNameInput.value).toBe("");
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementAutocomplete.value).toBe("");
  expect(trancheTypeAutocomplete.value).toBe("");
  expect(lienTypeAutocomplete).not.toBeChecked();
  expect(startDateInput.value).toBe("");
  expect(maturityDateInput).not.toBeChecked();
  expect(ebitdaInput.value).toBe("");
  expect(levRatioInput.value).toBe("");
  expect(netLevRatioInput.value).toBe("");
  expect(intCovInput).not.toBeChecked();
  expect(rateTypeAutocomplete.value).toBe("");
  expect(fixedInput.value).toBe("");
});
