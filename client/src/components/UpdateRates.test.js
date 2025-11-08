// ************************************************************************************************
// *     UT-54 – Testing populating and submitting Update Rate Data form                          *
// ************************************************************************************************

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import UpdateRates from "./UpdateRates";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-54 – Testing populating and submitting Update Rate Data form", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            legal_name: "Metroid Company",
            borrower_id: "800",
          },
          {
            legal_name: "Megaman Company",
            borrower_id: "801",
          },
          {
            legal_name: "Castlevania Company",
            borrower_id: "803",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            loan_agreement_id: "101",
            borrower_id: "800",
            loan_agreement_date: "2024-01-31",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "Metroid Company",
          },
          {
            loan_agreement_id: "201",
            borrower_id: "801",
            loan_agreement_date: "2025-11-31",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "Megaman Company",
          },
          {
            loan_agreement_id: "601",
            borrower_id: "802",
            loan_agreement_date: "2024-8-31",
            loan_agreement_name: "Loan Agreement Name 3",
            legal_name: "Castlevania Company",
          },
        ],
      });
    }

    if (url.includes("loantranchequery")) {
      return Promise.resolve({
        data: [
          {
            tranche_name: "Tranche 1",
            tranche_id: "111",
            loan_agreement_id: "101",
          },
          {
            tranche_name: "Tranche 2",
            tranche_id: "112",
            loan_agreement_id: "201",
          },
          {
            tranche_name: "Tranche 3",
            tranche_id: "113",
            loan_agreement_id: "601",
          },
        ],
      });
    }

    if (url.includes("rateDataQuery")) {
      return Promise.resolve({
        data: [
          {
            rate_data_id: "111",
            tranche_id: "5555",
            is_fixed: false,
            fixed_rate: null,
            spread: 0.05,
            floor: 0.025,
            start_date: "2023-06-30",
            end_date: null,
            has_floor: true,
            reference_rate: "LIBOR",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<UpdateRates />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/borrowerquery");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/loanagreementquery");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/loantranchequery");
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name *");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("Megaman Company"));
  expect(borrowerAutoComplete.value).toBe("Megaman Company");

  const loanAgreementName = screen.getByLabelText("Loan Agreement *");
  fireEvent.mouseDown(loanAgreementName);
  fireEvent.click(screen.getByText("Loan Agreement Name 2"));
  expect(loanAgreementName.value).toBe("Loan Agreement Name 2");

  const loanTrancheName = screen.getByLabelText("Loan Tranche *");
  fireEvent.mouseDown(loanTrancheName);
  fireEvent.click(screen.getByText("Tranche 2"));
  expect(loanTrancheName.value).toBe("Tranche 2");

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("rateDataQuery"),
      expect.objectContaining({
        params: { tranche_id: "112" },
      }),
    );
  });

  const changeDataInput = screen.getByLabelText("Change Date *", {
    selector: "input",
  });
  fireEvent.change(changeDataInput, { target: { value: "09/30/2025" } });
  expect(changeDataInput.value).toBe("09/30/2025");

  const rateTypeAutocomplete = screen.getByLabelText("Rate Type *");
  fireEvent.mouseDown(rateTypeAutocomplete);
  fireEvent.click(screen.getByText("Floating Rate"));
  expect(rateTypeAutocomplete.value).toBe("Floating Rate");

  const spreadTextBox = screen.getByLabelText("Spread *");
  fireEvent.change(spreadTextBox, {
    target: { value: "5.5" },
  });
  expect(spreadTextBox.value).toBe("5.500000%");

  const floorTextBox = screen.getByLabelText("Floor");
  fireEvent.change(floorTextBox, {
    target: { value: "0.5" },
  });
  expect(floorTextBox.value).toBe("0.500000%");

  const refRateAutocomplete = screen.getByLabelText("Reference Rate *");
  fireEvent.mouseDown(refRateAutocomplete);
  const liborSelection = screen.getAllByText("LIBOR");
  fireEvent.click(liborSelection[0]);
  expect(refRateAutocomplete.value).toBe("LIBOR");

  axios.post.mockResolvedValueOnce({ status: 201 });

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createratechange"),
      expect.objectContaining({
        trancheId: "112",
        changeDate: "2025-09-30",
        rateType: "Floating Rate",
        fixedCoupon: null,
        spread: 0.055,
        floor: 0.005,
        refRate: "LIBOR",
      }),
    );
  });

  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementName.value).toBe("");
  expect(loanTrancheName.value).toBe("");
  expect(changeDataInput.value).toBe("");
  expect(rateTypeAutocomplete.value).toBe("");
  expect(spreadTextBox.value).toBe("");
  expect(floorTextBox.value).toBe("");
  expect(refRateAutocomplete.value).toBe("");
});
