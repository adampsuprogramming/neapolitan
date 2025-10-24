// ************************************************************************************************
// *     UT-?? – Testing populating and submitting Update Metrics form                            *
// ************************************************************************************************

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import UpdateMetrics from "./UpdateMetrics";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-?? – Testing populating and submitting Update Rate Data form", async () => {
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

    if (url.includes("metricsQuery")) {
      return Promise.resolve({
        data: [
          {
            loan_metrics_id: 67891,
            tranche_id: "112",
            is_cov_default: true,
            is_payment_default: true,
            leverage_ratio: 6.025,
            net_leverage_ratio: 6,
            int_coverage_ratio: 3,
            ebitda: 1500000,
            start_date: "2024-12-31",
            end_date: "2029-12-31",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<UpdateMetrics />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/borrowerquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/loanagreementquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/loantranchequery",
    );
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
      expect.stringContaining("metricsQuery"),
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

  const levRatioTextBox = screen.getByLabelText("Leverage Ratio");
  fireEvent.change(levRatioTextBox, {
    target: { value: "5" },
  });
  expect(levRatioTextBox.value).toBe("5.000000");

  const spreadTextBox = screen.getByLabelText("Net Leverage Ratio");
  fireEvent.change(spreadTextBox, {
    target: { value: "4.75" },
  });
  expect(spreadTextBox.value).toBe("4.750000");

  const intCovTextBox = screen.getByLabelText("Interest Coverage Ratio");
  fireEvent.change(intCovTextBox, {
    target: { value: "2" },
  });
  expect(intCovTextBox.value).toBe("2.000000");

  const ebitda = screen.getByLabelText("EBITDA");
  fireEvent.change(ebitda, {
    target: { value: "15000000" },
  });
  expect(ebitda.value).toBe("$15,000,000.00");

  const toggleCovDefault = screen.getByLabelText("Covenant Default");
  fireEvent.click(toggleCovDefault);
  expect(toggleCovDefault).toBeChecked();

  const togglePymtDefault = screen.getByLabelText("Payment Default");
  fireEvent.click(togglePymtDefault);
  expect(togglePymtDefault).toBeChecked();

  axios.post.mockResolvedValueOnce({ status: 201 });

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createMetricsChange"),
      expect.objectContaining({
        trancheId: "112",
        changeDate: "2025-09-30",
        isCovDefault: true,
        isPaymentDefault: true,
        leverageRatio: 5,
        netLeverageRatio: 4.75,
        intCoverageRatio: 2,
        ebitda: 15000000,
      }),
    );
  });

  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementName.value).toBe("");
  expect(loanTrancheName.value).toBe("");
  expect(changeDataInput.value).toBe("");
  expect(levRatioTextBox.value).toBe("");
  expect(spreadTextBox.value).toBe("");
  expect(intCovTextBox.value).toBe("");
  expect(ebitda.value).toBe("");
  expect(toggleCovDefault.checked).toBe(false);
  expect(togglePymtDefault.checked).toBe(false);
});
