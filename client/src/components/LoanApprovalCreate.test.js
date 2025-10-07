// ************************************************************************************************
// *     UT-40 – Populating borrower dropdown from API call -- /api/borrowerquery                 *
// *     UT-41 – Populating loan agreement dropdown from API call -- /api/loanagreementquery      *
// *     UT-42 – Populating loan tranche dropdown from API call -- /api/loantranchequery          *
// *     UT-43 – Populating lender name from API call -- /api/lenderQuery                         *
// *     UT-44 – Populating loan facilities dropdown -- /api/facilities                           *
// *     UT-45 – Testing populating and submitting create Loan Approval form                      *
// ************************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import LoanApprovalCreate from "./LoanApprovalCreate";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-40 – Populating borrower dropdown from API call -- /api/borrowerquery", async () => {
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

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  const borrowerName = screen.getByLabelText("Borrower Name");

  fireEvent.mouseDown(borrowerName);

  expect(screen.getByText("Megaman Company")).toBeInTheDocument();
});

test("UT-41 – Populating loan agreement dropdown from API call -- /api/loanagreementquery", async () => {
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

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

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
  fireEvent.click(screen.getByText("Megaman Company"));

  const loanAgreementName = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementName);
  expect(screen.getByText("Loan Agreement Name 2")).toBeInTheDocument();
});

test("UT-42 – Populating loan tranche dropdown from API call -- /api/loantranchequery", async () => {
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

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

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

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loantranchequery",
    );
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("Megaman Company"));

  const loanAgreementName = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementName);
  fireEvent.click(screen.getByText("Loan Agreement Name 2"));

  const loanTrancheName = screen.getByLabelText("Loan Tranche");
  fireEvent.mouseDown(loanTrancheName);
  expect(screen.getByText("Tranche 2")).toBeInTheDocument();
});

test("UT-43 – Populating lender name from API call -- /api/lenderQuery", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("lenderquery")) {
      return Promise.resolve({
        data: [
          {
            lender_name: "Lender 1",
            lender_id: "151",
          },
          {
            lender_name: "Lender 2",
            lender_id: "152",
          },
          {
            lender_name: "Lender 3",
            lender_id: "153",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/lenderquery",
    );
  });

  const lenderName = screen.getByLabelText("Lender Name");
  fireEvent.mouseDown(lenderName);
  expect(screen.getByText("Lender 3")).toBeInTheDocument();
});

test("UT-44 – Populating loan facilities dropdown -- /api/facilities", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("lenderquery")) {
      return Promise.resolve({
        data: [
          {
            lender_name: "Lender 1",
            lender_id: "151",
          },
          {
            lender_name: "Lender 2",
            lender_id: "152",
          },
          {
            lender_name: "Lender 3",
            lender_id: "153",
          },
        ],
      });
    }

    if (url.includes("facilities")) {
      return Promise.resolve({
        data: [
          {
            portfolio_name: "Test Porfolio A",
            debt_facility_name: "Test Debt Facility A",
            debt_facility_id: "11111",
            lender_name: "Lender 1",
            lender_id: "151",
            outstanding_amount: 10000000.0,
            overall_commitment_amount: 10000000.0,
          },
          {
            portfolio_name: "Test Porfolio B",
            debt_facility_name: "Test Debt Facility B",
            debt_facility_id: "11112",
            lender_name: "Lender 2",
            lender_id: "152",
            outstanding_amount: 20000000.0,
            overall_commitment_amount: 20000000.0,
          },
          {
            portfolio_name: "Test Porfolio C",
            debt_facility_name: "Test Debt Facility C",
            debt_facility_id: "11113",
            lender_name: "Lender 3",
            lender_id: "153",
            outstanding_amount: 30000000.0,
            overall_commitment_amount: 30000000.0,
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/lenderquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/facilities",
    );
  });

  const lenderAutoComplete = screen.getByLabelText("Lender Name");
  fireEvent.mouseDown(lenderAutoComplete);
  fireEvent.click(screen.getByText("Lender 2"));

  const facilityName = screen.getByLabelText("Loan Facilities");
  fireEvent.mouseDown(facilityName);
  expect(screen.getByText("Test Debt Facility B")).toBeInTheDocument();
});

test("UT-45 – Testing populating and submitting create Loan Approval form", async () => {
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

    if (url.includes("lenderquery")) {
      return Promise.resolve({
        data: [
          {
            lender_name: "Lender 1",
            lender_id: "151",
          },
          {
            lender_name: "Lender 2",
            lender_id: "152",
          },
          {
            lender_name: "Lender 3",
            lender_id: "153",
          },
        ],
      });
    }

    if (url.includes("facilities")) {
      return Promise.resolve({
        data: [
          {
            portfolio_name: "Test Porfolio A",
            debt_facility_name: "Test Debt Facility A",
            debt_facility_id: "11111",
            lender_name: "Lender 1",
            lender_id: "151",
            outstanding_amount: 10000000.0,
            overall_commitment_amount: 10000000.0,
          },
          {
            portfolio_name: "Test Porfolio B",
            debt_facility_name: "Test Debt Facility B",
            debt_facility_id: "11112",
            lender_name: "Lender 2",
            lender_id: "152",
            outstanding_amount: 20000000.0,
            overall_commitment_amount: 20000000.0,
          },
          {
            portfolio_name: "Test Porfolio C",
            debt_facility_name: "Test Debt Facility C",
            debt_facility_id: "11113",
            lender_name: "Lender 3",
            lender_id: "153",
            outstanding_amount: 30000000.0,
            overall_commitment_amount: 30000000.0,
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanApprovalCreate />);

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

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loantranchequery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/lenderquery",
    );
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/facilities",
    );
  });

  const borrowerAutoComplete = screen.getByLabelText("Borrower Name");
  fireEvent.mouseDown(borrowerAutoComplete);
  fireEvent.click(screen.getByText("Megaman Company"));
  expect(borrowerAutoComplete.value).toBe("Megaman Company");

  const loanAgreementName = screen.getByLabelText("Loan Agreement");
  fireEvent.mouseDown(loanAgreementName);
  fireEvent.click(screen.getByText("Loan Agreement Name 2"));
  expect(loanAgreementName.value).toBe("Loan Agreement Name 2");

  const loanTrancheName = screen.getByLabelText("Loan Tranche");
  fireEvent.mouseDown(loanTrancheName);
  fireEvent.click(screen.getByText("Tranche 2"));
  expect(loanTrancheName.value).toBe("Tranche 2");

  const lenderAutoComplete = screen.getByLabelText("Lender Name");
  fireEvent.mouseDown(lenderAutoComplete);
  fireEvent.click(screen.getByText("Lender 2"));
  expect(lenderAutoComplete.value).toBe("Lender 2");

  const facilityName = screen.getByLabelText("Loan Facilities");
  fireEvent.mouseDown(facilityName);
  fireEvent.click(screen.getByText("Test Debt Facility B"));
  expect(facilityName.value).toBe("Test Debt Facility B");

  const approvalDateInput = screen.getByLabelText("Approval Date", {
    selector: "input",
  });
  fireEvent.change(approvalDateInput, { target: { value: "09/02/2025" } });
  expect(approvalDateInput.value).toBe("09/02/2025");

  const approvalDateExpiration = screen.getByLabelText("Approval Expiration", {
    selector: "input",
  });
  fireEvent.change(approvalDateExpiration, { target: { value: "11/02/2025" } });
  expect(approvalDateExpiration.value).toBe("11/02/2025");

  const approvedAmount = screen.getByLabelText("Approved Amount");
  fireEvent.change(approvedAmount, {
    target: { value: "10000000" },
  });
  expect(approvedAmount.value).toBe("$10,000,000.00");

  const approvedEbitda = screen.getByLabelText("Approved EBITDA");
  fireEvent.change(approvedEbitda, {
    target: { value: "20000000" },
  });
  expect(approvedEbitda.value).toBe("$20,000,000.00");

  const leverageRatio = screen.getByLabelText("Leverage Ratio");
  fireEvent.change(leverageRatio, {
    target: { value: "4.952" },
  });
  expect(leverageRatio.value).toBe("4.952000");

  const intCoverageRatio = screen.getByLabelText("Interest Coverage Ratio");
  fireEvent.change(intCoverageRatio, {
    target: { value: "2.1" },
  });
  expect(intCoverageRatio.value).toBe("2.100000");

  const netLeverageRatio = screen.getByLabelText("Net Leverage Ratio");
  fireEvent.change(netLeverageRatio, {
    target: { value: "4.552" },
  });
  expect(netLeverageRatio.value).toBe("4.552000");

  const appAdvRate = screen.getByLabelText("Approved Advance Rate");
  fireEvent.change(appAdvRate, {
    target: { value: "65" },
  });
  expect(appAdvRate.value).toBe("65.000000%");

  const approvedValue = screen.getByLabelText("Approved Value");
  fireEvent.change(approvedValue, {
    target: { value: "98" },
  });
  expect(approvedValue.value).toBe("98.000000%");

  axios.post.mockResolvedValueOnce({ status: 201 });

  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createloanapproval"),
      expect.objectContaining({
        approvalName: "2025-09-02 - Lender 2 - Megaman Company",
        selectedTrancheId: "112",
        selectedFacilityId: "11112",
        approvalDate: "2025-09-02",
        approvalExpiration: "2025-11-02",
        approvedAmount: 10000000,
        approvedEbitda: 20000000,
        approvedLeverageRatio: 4.952,
        approvedInterestCoverage: 2.1,
        approvedNetLeverageRatio: 4.552,
        approvedAdvanceRate: 0.65,
        approvedValue: 0.98,
      }),
    );
  });

  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(borrowerAutoComplete.value).toBe("");
  expect(loanAgreementName.value).toBe("");
  expect(loanTrancheName.value).toBe("");
  expect(lenderAutoComplete.value).toBe("");
  expect(facilityName.value).toBe("");
  expect(approvalDateInput.value).toBe("");
  expect(approvalDateExpiration.value).toBe("");
  expect(approvedAmount.value).toBe("");
  expect(approvedEbitda.value).toBe("");
  expect(leverageRatio.value).toBe("");
  expect(intCoverageRatio.value).toBe("");
  expect(netLeverageRatio.value).toBe("");
  expect(appAdvRate.value).toBe("");
  expect(approvedValue.value).toBe("");
});
