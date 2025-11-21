// ************************************************************************************************
// *     UT-120 Testing populating and submitting Update Bank Metrics form                        *
// ************************************************************************************************

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import UpdateBankMetrics from "./UpdateBankMetrics";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-120 – Testing populating and submitting Update Bank Metrics Data form", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("facilities")) {
      return Promise.resolve({
        data: [
          {
            portfolio_name: "Playstation Portfolio",
            debt_facility_name: "PS5 Facility",
            debt_facility_id: 111,
            lender_name: "Horizon Zero Dawn Bank",
            lender_id: 100,
            outstanding_amount: 555555.55,
            overall_commitment_amount: 555555.55,
          },
          {
            portfolio_name: "Playstation Portfolio",
            debt_facility_name: "PS4 Facility",
            debt_facility_id: 110,
            lender_name: "Ratchet and Clank Bank",
            lender_id: 10,
            outstanding_amount: 100000000,
            overall_commitment_amount: 90000000,
          },
          {
            portfolio_name: "Xbox Portfolio",
            debt_facility_name: "Xbox 360 Facility",
            debt_facility_id: 120,
            lender_name: "Halo Bank",
            lender_id: 20,
            outstanding_amount: 400000000,
            overall_commitment_amount: 30000000,
          },
        ],
      });
    }

    if (url.includes("borrowerquerybyfacility")) {
      return Promise.resolve({
        data: [
          {
            collateral_id: 123,
            debt_facility_id: 120,
            tranche_id: 789,
            inclusion_date: "2025-03-01",
            removed_date: null,
            legal_name: "The Mario Company",
          },
          {
            collateral_id: 111,
            debt_facility_id: 120,
            tranche_id: 777,
            inclusion_date: "2025-04-01",
            removed_date: null,
            legal_name: "The Yoshi Company",
          },
        ],
      });
    }

    if (url.includes("loanagreementquery")) {
      return Promise.resolve({
        data: [
          {
            loan_agreement_id: 101,
            borrower_id: 800,
            loan_agreement_date: "2025-03-01",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "The Mario Company",
          },
          {
            loan_agreement_id: 201,
            borrower_id: 801,
            loan_agreement_date: "2025-04-01",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "The Yoshi Company",
          },
        ],
      });
    }

    if (url.includes("loantranchequery")) {
      return Promise.resolve({
        data: [
          {
            tranche_name: "Tranche 1",
            tranche_id: 789,
            loan_agreement_id: 101,
          },
          {
            tranche_name: "Tranche 2",
            tranche_id: 777,
            loan_agreement_id: 201,
          },
        ],
      });
    }

    if (url.includes("metricsQuery")) {
      return Promise.resolve({
        data: [
          {
            collateral_id: 123,
            start_date: "2025-03-01",
            end_date: "2030-03-01",
            advance_rate: 0.655,
            valuation: 0.915,
            bank_metrics_id: 789,
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<UpdateBankMetrics />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/facilities");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/loanagreementquery");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/loantranchequery");
  });

  const portfolioAutoComplete = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioAutoComplete);
  fireEvent.click(screen.getByText("Xbox Portfolio"));
  expect(portfolioAutoComplete.value).toBe("Xbox Portfolio");

  const facilityAutoComplete = screen.getByLabelText("Facility Name *");
  fireEvent.mouseDown(facilityAutoComplete);
  fireEvent.click(screen.getByText("Xbox 360 Facility"));
  expect(facilityAutoComplete.value).toBe("Xbox 360 Facility");

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/borrowerquerybyfacility",
      expect.objectContaining({
        params: { debtFacilityId: 120 },
      }),
    );
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name *");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("The Mario Company"));
  expect(borrowerAutoComplete.value).toBe("The Mario Company");

  const loanAgreementName = screen.getByLabelText("Loan Agreement *");
  fireEvent.mouseDown(loanAgreementName);
  fireEvent.click(screen.getByText("Loan Agreement Name 1"));
  expect(loanAgreementName.value).toBe("Loan Agreement Name 1");

  const loanTrancheName = screen.getByLabelText("Loan Tranche *");
  fireEvent.mouseDown(loanTrancheName);
  fireEvent.click(screen.getByText("Tranche 1"));
  expect(loanTrancheName.value).toBe("Tranche 1");

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("bankMetricsQuery"),
      expect.objectContaining({
        params: { collateral_id: 123 },
      }),
    );
  });

  const changeDataInput = screen.getByLabelText("Change Date *", {
    selector: "input",
  });
  fireEvent.change(changeDataInput, { target: { value: "09/30/2025" } });
  expect(changeDataInput.value).toBe("09/30/2025");

  const advRateTextBox = screen.getByLabelText("Advance Rate");
  fireEvent.change(advRateTextBox, {
    target: { value: "95" },
  });
  expect(advRateTextBox.value).toBe("95.000000%");

  const valuationTextBox = screen.getByLabelText("Valuation");
  fireEvent.change(valuationTextBox, {
    target: { value: "99" },
  });
  expect(valuationTextBox.value).toBe("99.000000%");

  axios.post.mockResolvedValueOnce({ status: 201 });

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createBankMetricsChange"),
      expect.objectContaining({
        collateralId: 123,
        advanceRate: 0.95,
        valuation: 0.99,
        changeDate: "2025-09-30",
      }),
    );
  });

  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementName.value).toBe("");
  expect(loanTrancheName.value).toBe("");
  expect(changeDataInput.value).toBe("");
  expect(portfolioAutoComplete.value).toBe("");
  expect(facilityAutoComplete.value).toBe("");
  expect(advRateTextBox.value).toBe("");
  expect(valuationTextBox.value).toBe("");
});
