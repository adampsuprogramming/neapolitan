// ************************************************************************************************
// *     UT-48 – Testing populating and submitting create Collateral Pledge form                  *
// *     UT-49 - UT-49 – Testing Error Message if Inclusion Date is On or After Expiration Date   *
// *     UT-50 – Testing Error Message if Outstanding Amount is Greater than Commitment Amount    *
// *     UT-51 - Testing Error Message if Outstanding Amount is Greater than Approval Amount      *
// ************************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import CollateralPledgeAdd from "./CollateralPledgeAdd";
import { fireEvent } from "@testing-library/react";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-48 - Testing PUT API Call to Collateral Pledge After Filling in Data from Form", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("loanapprovalquery")) {
      return Promise.resolve({
        data: [
          {
            approved_amount: 10000000,
            loan_approval_name: "Loan Approval Name 1",
            approval_expiration: "2028-01-01",
            tranche_name: "Tranche Name 1",
            tranche_id: "301",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "Legal Name 1",
            lender_name: "Lender 1",
            debt_facility_name: "Debt Facility 1",
            debt_facility_id: "501",
            loan_approval_id: "801",
          },
          {
            approved_amount: 20000000,
            loan_approval_name: "Loan Approval Name 2",
            approval_expiration: "2028-02-02",
            tranche_name: "Tranche Name 2",
            tranche_id: "302",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "Legal Name 2",
            lender_name: "Lender 2",
            debt_facility_name: "Debt Facility 2",
            debt_facility_id: "502",
            loan_approval_id: "802",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<CollateralPledgeAdd />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanapprovalquery",
    );
  });

  // Find loan approval and input name
  const loanApproval = screen.getByLabelText("Select Loan Approval");
  fireEvent.mouseDown(loanApproval);
  fireEvent.click(screen.getByText("Loan Approval Name 2"));
  expect(loanApproval.value).toBe("Loan Approval Name 2");

  // Find inclusion date and input
  const inclusionDateInput = screen.getByLabelText("Inclusion Date", {
    selector: "input",
  });
  fireEvent.change(inclusionDateInput, { target: { value: "01/02/2025" } });
  expect(inclusionDateInput.value).toBe("01/02/2025");

  // Find Outstanding Pledged and Input Text
  const outstandingPledged = screen.getByLabelText("Outstanding Pledged *");
  fireEvent.change(outstandingPledged, {
    target: { value: "9000000" },
  });
  expect(outstandingPledged.value).toBe("$9,000,000.00");

  // Find Commitment Pledged and Input Text
  const commitmentPledged = screen.getByLabelText("Commitment Pledged *");
  fireEvent.change(commitmentPledged, {
    target: { value: "9000000" },
  });
  expect(commitmentPledged.value).toBe("$9,000,000.00");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Pledge Collateral");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createcollateral"),
      expect.objectContaining({
        loanApprovalId: "802",
        debtFacilityId: "502",
        trancheId: "302",
        inclusionDate: "2025-01-02",
        outstandingAmount: 9000000,
        commitmentAmount: 9000000,
      }),
    );
  });

  // simulate cancel click
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(loanApproval.value).toBe("");
  expect(inclusionDateInput.value).toBe("");
  expect(outstandingPledged.value).toBe("");
  expect(commitmentPledged.value).toBe("");
});

test("UT-49 - Testing Error Message if Inclusion Date Is On or After Expiration Date", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("loanapprovalquery")) {
      return Promise.resolve({
        data: [
          {
            approved_amount: 10000000,
            loan_approval_name: "Loan Approval Name 1",
            approval_expiration: "2024-01-01",
            tranche_name: "Tranche Name 1",
            tranche_id: "301",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "Legal Name 1",
            lender_name: "Lender 1",
            debt_facility_name: "Debt Facility 1",
            debt_facility_id: "501",
            loan_approval_id: "801",
          },
          {
            approved_amount: 20000000,
            loan_approval_name: "Loan Approval Name 2",
            approval_expiration: "2024-02-02",
            tranche_name: "Tranche Name 2",
            tranche_id: "302",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "Legal Name 2",
            lender_name: "Lender 2",
            debt_facility_name: "Debt Facility 2",
            debt_facility_id: "502",
            loan_approval_id: "802",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<CollateralPledgeAdd />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanapprovalquery",
    );
  });

  // Find loan approval and input name
  const loanApproval = screen.getByLabelText("Select Loan Approval");
  fireEvent.mouseDown(loanApproval);
  fireEvent.click(screen.getByText("Loan Approval Name 2"));
  expect(loanApproval.value).toBe("Loan Approval Name 2");

  // Find inclusion date and input
  const inclusionDateInput = screen.getByLabelText("Inclusion Date", {
    selector: "input",
  });
  fireEvent.change(inclusionDateInput, { target: { value: "01/02/2025" } });
  expect(inclusionDateInput.value).toBe("01/02/2025");

  // Find Outstanding Pledged and Input Text
  const outstandingPledged = screen.getByLabelText("Outstanding Pledged *");
  fireEvent.change(outstandingPledged, {
    target: { value: "9000000" },
  });
  expect(outstandingPledged.value).toBe("$9,000,000.00");

  // Find Commitment Pledged and Input Text
  const commitmentPledged = screen.getByLabelText("Commitment Pledged *");
  fireEvent.change(commitmentPledged, {
    target: { value: "9000000" },
  });
  expect(commitmentPledged.value).toBe("$9,000,000.00");

  // simulate save click
  const saveButton = screen.getByText("Pledge Collateral");
  fireEvent.click(saveButton);

  const errorMessage = screen.getByText(
    "Inclusion Date Must Be Prior to Expiration Date",
  );
  expect(errorMessage).toBeVisible();
});

test("UT-50 - Testing Error Message if Outstanding Amount is Greater than Commitment Amount", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("loanapprovalquery")) {
      return Promise.resolve({
        data: [
          {
            approved_amount: 10000000,
            loan_approval_name: "Loan Approval Name 1",
            approval_expiration: "2028-01-01",
            tranche_name: "Tranche Name 1",
            tranche_id: "301",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "Legal Name 1",
            lender_name: "Lender 1",
            debt_facility_name: "Debt Facility 1",
            debt_facility_id: "501",
            loan_approval_id: "801",
          },
          {
            approved_amount: 20000000,
            loan_approval_name: "Loan Approval Name 2",
            approval_expiration: "2028-02-02",
            tranche_name: "Tranche Name 2",
            tranche_id: "302",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "Legal Name 2",
            lender_name: "Lender 2",
            debt_facility_name: "Debt Facility 2",
            debt_facility_id: "502",
            loan_approval_id: "802",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<CollateralPledgeAdd />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanapprovalquery",
    );
  });

  // Find loan approval and input name
  const loanApproval = screen.getByLabelText("Select Loan Approval");
  fireEvent.mouseDown(loanApproval);
  fireEvent.click(screen.getByText("Loan Approval Name 2"));
  expect(loanApproval.value).toBe("Loan Approval Name 2");

  // Find inclusion date and input
  const inclusionDateInput = screen.getByLabelText("Inclusion Date", {
    selector: "input",
  });
  fireEvent.change(inclusionDateInput, { target: { value: "01/02/2025" } });
  expect(inclusionDateInput.value).toBe("01/02/2025");

  // Find Outstanding Pledged and Input Text
  const outstandingPledged = screen.getByLabelText("Outstanding Pledged *");
  fireEvent.change(outstandingPledged, {
    target: { value: "10000000" },
  });
  expect(outstandingPledged.value).toBe("$10,000,000.00");

  // Find Commitment Pledged and Input Text
  const commitmentPledged = screen.getByLabelText("Commitment Pledged *");
  fireEvent.change(commitmentPledged, {
    target: { value: "9000000" },
  });
  expect(commitmentPledged.value).toBe("$9,000,000.00");

  // simulate save click
  const saveButton = screen.getByText("Pledge Collateral");
  fireEvent.click(saveButton);

  const errorMessage = screen.getByText(
    "Outstanding Amount Must Be Less Than Or Equal To Commitment Amount",
  );
  expect(errorMessage).toBeVisible();
});

test("UT-51 - Testing Error Message if Outstanding Amount is Greater than Approval Amount", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("loanapprovalquery")) {
      return Promise.resolve({
        data: [
          {
            approved_amount: 10000000,
            loan_approval_name: "Loan Approval Name 1",
            approval_expiration: "2028-01-01",
            tranche_name: "Tranche Name 1",
            tranche_id: "301",
            loan_agreement_name: "Loan Agreement Name 1",
            legal_name: "Legal Name 1",
            lender_name: "Lender 1",
            debt_facility_name: "Debt Facility 1",
            debt_facility_id: "501",
            loan_approval_id: "801",
          },
          {
            approved_amount: 20000000,
            loan_approval_name: "Loan Approval Name 2",
            approval_expiration: "2028-02-02",
            tranche_name: "Tranche Name 2",
            tranche_id: "302",
            loan_agreement_name: "Loan Agreement Name 2",
            legal_name: "Legal Name 2",
            lender_name: "Lender 2",
            debt_facility_name: "Debt Facility 2",
            debt_facility_id: "502",
            loan_approval_id: "802",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<CollateralPledgeAdd />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/loanapprovalquery",
    );
  });

  // Find loan approval and input name
  const loanApproval = screen.getByLabelText("Select Loan Approval");
  fireEvent.mouseDown(loanApproval);
  fireEvent.click(screen.getByText("Loan Approval Name 2"));
  expect(loanApproval.value).toBe("Loan Approval Name 2");

  // Find inclusion date and input
  const inclusionDateInput = screen.getByLabelText("Inclusion Date", {
    selector: "input",
  });
  fireEvent.change(inclusionDateInput, { target: { value: "01/02/2025" } });
  expect(inclusionDateInput.value).toBe("01/02/2025");

  // Find Outstanding Pledged and Input Text
  const outstandingPledged = screen.getByLabelText("Outstanding Pledged *");
  fireEvent.change(outstandingPledged, {
    target: { value: "30000000" },
  });
  expect(outstandingPledged.value).toBe("$30,000,000.00");

  // Find Commitment Pledged and Input Text
  const commitmentPledged = screen.getByLabelText("Commitment Pledged *");
  fireEvent.change(commitmentPledged, {
    target: { value: "30000000" },
  });
  expect(commitmentPledged.value).toBe("$30,000,000.00");

  // simulate save click
  const saveButton = screen.getByText("Pledge Collateral");
  fireEvent.click(saveButton);

  const errorMessage = screen.getByText(
    "Outstanding Amount Must Be Less Than Or Equal To Maximum Approved",
  );
  expect(errorMessage).toBeVisible();
});
