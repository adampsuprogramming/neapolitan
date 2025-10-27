// ********************************************************************************************
// *     UT-69 – Ensure payment page can populate after making selections, inputs format      *
// *     properly, and submission is handled                                                  *
// ********************************************************************************************


import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import PaymentsReceived from "./PaymentsReceived";
import { fireEvent } from "@testing-library/react";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: [] })),
}));

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-69: Ensure payment page can populate after making selections, inputs format properly, and submission is handled", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("facilities")) {
      return Promise.resolve({
        data: [
          {
            portfolio_name: "Fund Apple",
            debt_facility_name: "Orchard Bank Fund Apple Facility",
            debt_facility_id: 5,
            lender_name: "Orchard Bank (Test)",
            outstanding_amount: "1234567",
            overall_commitment_amount: "1234567",
          },
          {
            portfolio_name: "Fund Banana",
            debt_facility_name: "Tree Bank Fund Banana",
            debt_facility_id: 6,
            lender_name: "Tree Bank",
            outstanding_amount: "50000000.00",
            overall_commitment_amount: "100000000.00",
          },
          {
            portfolio_name: "Fund Apple",
            debt_facility_name: "Golden Bank Fund Apple Facility",
            debt_facility_id: 7,
            lender_name: "Golden Bank",
            outstanding_amount: "5000000.00",
            overall_commitment_amount: "6000000.00",
          },
          {
            portfolio_name: "Fund Banana",
            debt_facility_name: "Happy Bank Banana Facility",
            debt_facility_id: 8,
            lender_name: "Happy Bank",
            outstanding_amount: "40000000.00",
            overall_commitment_amount: "110000000.00",
          },
        ],
      });
    }

    if (url.includes("borrowbase")) {
      return Promise.resolve({
        data: [
          {
            collateral_id: 100,
            inclusion_date: "2023-11-30T05:00:00.000Z",
            removed_date: null,
            approval_date: "2025-10-15T05:00:00.000Z",
            approved_ebitda: "15000000.00",
            approved_net_leverage: "6.15000000",
            approved_int_coverage: "1.25000000",
            approved_advance_rate: "0.60000000",
            approved_valuation: "0.95000000",
            approved_leverage: "4.25000000",
            commitment_amount: "7500000.00",
            outstanding_amount: "7500000.00",
            lien_type: "Second",
            maturity_date: "2028-08-10T04:00:00.000Z",
            tranche_type: "Term",
            loan_agreement_date: "2023-10-11T04:00:00.000Z",
            legal_name: "Test Company A",
            short_name: "TestCo",
            ebitda: "45222222.22",
            loan_metrics_start_date: "2023-08-10T04:00:00.000Z",
            int_coverage_ratio: "0.5454",
            is_cov_default: false,
            is_payment_default: false,
            leverage_ratio: "4.48548",
            loan_metrics_id: 454,
            net_leverage_ratio: "7.45451",
            rate_start_date: "2028-04-10T04:00:00.000Z",
            end_date: "2028-06-10T04:00:00.000Z",
            fixed_rate: null,
            floor: null,
            has_floor: false,
            is_fixed: false,
            reference_rate: "LIBOR",
            spread: "0.10450000",
          },
          {
            collateral_id: 101,
            inclusion_date: "2023-08-10T05:00:00.000Z",
            removed_date: null,
            approval_date: "2023-07-11T05:00:00.000Z",
            approved_ebitda: "40000000.00",
            approved_net_leverage: "1.65000000",
            approved_int_coverage: "5.00000000",
            approved_advance_rate: null,
            approved_valuation: "1.0000000",
            approved_leverage: "2.40000000",
            commitment_amount: "56000000.00",
            outstanding_amount: "56000000.00",
            lien_type: "Second",
            maturity_date: "2029-03-01T04:00:00.000Z",
            tranche_type: "Term",
            loan_agreement_date: "2024-03-01T04:00:00.000Z",
            legal_name: "Test No 2",
            short_name: "Test2",
            ebitda: "45000000.00",
            loan_metrics_start_date: "2024-10-01T04:00:00.000Z",
            int_coverage_ratio: "6.100000",
            is_cov_default: false,
            is_payment_default: false,
            leverage_ratio: "1.485458",
            loan_metrics_id: 245,
            net_leverage_ratio: "1.06481",
            rate_start_date: "2028-11-01T04:00:00.000Z",
            end_date: "2029-01-01T04:00:00.000Z",
            fixed_rate: "0.09500000",
            floor: null,
            has_floor: false,
            is_fixed: true,
            reference_rate: "",
            spread: null,
          },
          {
            collateral_id: 102,
            inclusion_date: "2023-11-15T05:00:00.000Z",
            removed_date: null,
            approval_date: "2023-11-20T05:00:00.000Z",
            approved_ebitda: "15000000.00",
            approved_net_leverage: "1.85000000",
            approved_int_coverage: "4.46000000",
            approved_advance_rate: null,
            approved_valuation: "2.150000",
            approved_leverage: "2.85000000",
            commitment_amount: "98000000.00",
            outstanding_amount: "98000000.00",
            lien_type: "first",
            maturity_date: "2029-12-01T04:00:00.000Z",
            tranche_type: "Term",
            loan_agreement_date: "2024-12-01T04:00:00.000Z",
            legal_name: "Test No 3",
            short_name: "Test3",
            ebitda: "85000000.00",
            loan_metrics_start_date: "2025-01-01T04:00:00.000Z",
            int_coverage_ratio: "5.100000",
            is_cov_default: false,
            is_payment_default: false,
            leverage_ratio: "1.454581",
            loan_metrics_id: 246,
            net_leverage_ratio: "2.0145",
            rate_start_date: "2025-09-01T04:00:00.000Z",
            end_date: null,
            fixed_rate: null,
            floor: "1.50",
            has_floor: true,
            is_fixed: false,
            reference_rate: "LIBOR",
            spread: "4.5",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<PaymentsReceived />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/facilities",
    );
  });

  // Test Selecting Portfolio Name
  const portfolioNameInput = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioNameInput);
  fireEvent.click(screen.getByText("Fund Banana"));

  // Test Selecting Facility Name
  const facilityNameInput = screen.getByLabelText("Facility Name *");
  fireEvent.mouseDown(facilityNameInput);
  fireEvent.click(screen.getByText("Happy Bank Banana Facility"));

  // Test Selecting Inputting Date
  const paymentDateInput = screen.getByLabelText("Payment Date", {
    selector: "input",
  });
  fireEvent.change(paymentDateInput, { target: { value: "07/31/2025" } });
  expect(paymentDateInput.value).toBe("07/31/2025");

  // Test Values in Row 2 and Inputs
  await waitFor(() => {
    expect(screen.getByText("Test No 2")).toBeInTheDocument();
  });

  const testRow2 = screen.getByRole("row", { name: /Test No 2/i });
  const testCells2 = within(testRow2).getAllByRole("cell");

  expect(testCells2[0]).toHaveTextContent("101");
  expect(testCells2[1]).toHaveTextContent("Test No 2");
  expect(testCells2[2]).toHaveTextContent("$56,000,000.00");
  expect(testCells2[3]).toHaveTextContent("$56,000,000.00");

  const row2Inputs = within(testRow2).getAllByRole("textbox");
  const princRecRow2 = row2Inputs[0];
  fireEvent.change(princRecRow2, { target: { value: "3000000" } });
  expect(princRecRow2.value).toBe("$3,000,000.00");

  const intRecRow2 = row2Inputs[1];
  fireEvent.change(intRecRow2, { target: { value: "200000" } });
  expect(intRecRow2.value).toBe("$200,000.00");

  // Test Values in Row 2 and Inputs

  const testRow3 = screen.getByRole("row", { name: /Test No 3/i });
  const testCells3 = within(testRow3).getAllByRole("cell");

  expect(testCells3[0]).toHaveTextContent("102");
  expect(testCells3[1]).toHaveTextContent("Test No 3");
  expect(testCells3[2]).toHaveTextContent("$98,000,000.00");
  expect(testCells3[3]).toHaveTextContent("$98,000,000.00");

  const row3Inputs = within(testRow3).getAllByRole("textbox");
  const princRecRow3 = row3Inputs[0];
  fireEvent.change(princRecRow3, { target: { value: "4000000" } });
  expect(princRecRow3.value).toBe("$4,000,000.00");

  const intRecRow3 = row3Inputs[1];
  fireEvent.change(intRecRow3, { target: { value: "300000" } });
  expect(intRecRow3.value).toBe("$300,000.00");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  // ensure that API is being called with correct payload
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createPayments"),
      expect.objectContaining({
        paymentDate: "2025-07-31",
        paymentsReceived: [
          {
            collateralId: 101,
            commitment: 53000000.0,
            outstanding: 53000000.0,
            principalReceived: 3000000.0,
            interestReceived: 200000.0,
          },
          {
            collateralId: 102,
            commitment: 94000000.0,
            outstanding: 94000000.0,
            principalReceived: 4000000.0,
            interestReceived: 300000.0,
          },
        ],
      }),
    );
  });
});
