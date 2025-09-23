import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import BorrowBaseLineItemView from "./BorrowBaseLineItemView";
import { fireEvent } from "@testing-library/react";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();
});

// UT-1: Unit Test to determine:
// 1 - If, on page load, the API is called
// 2 - If the first dropdown menu is populated with options from the API call
// 3 - If those option are deduplicated and ordered prior to populating

test("UT-1: Portfolio data correctly loads from API on page load into dropdown menu", async () => {
  axios.get.mockResolvedValueOnce({
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

  render(<BorrowBaseLineItemView />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/facilities",
    );
  });

  const combos_portfolio = await screen.findByLabelText("Portfolio Name");
  const options = await within(combos_portfolio).findAllByRole("option");
  const texts = options.map((opt) => opt.textContent);

  expect(texts).toEqual(["Choose a Portfolio", "Fund Apple", "Fund Banana"]);
});

// UT-2: Unit Test to determine:
// 1 - If, after page load and selection from first dropdown, second dropdown populates with a filtered
// List of facilities related to the first dropdown
// 2 - If the first dropdown menu is populated with options from the API call
// 3 - If those option are deduplicated and ordered prior to populating

test("UT-2: Facility data correctly loads into second dropdown menu after choice is made in first dropdown", async () => {
  
  axios.get.mockResolvedValueOnce({
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

  render(<BorrowBaseLineItemView />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/facilities",
    );
  });

  const combos_portfolio = await screen.findByLabelText("Portfolio Name");
  const options = await within(combos_portfolio).findAllByRole("option");
  const portfolioText = options.map((opt) => opt.textContent);

  expect(portfolioText).toEqual([
    "Choose a Portfolio",
    "Fund Apple",
    "Fund Banana",
  ]);

  const portfolioSelect = screen.getByLabelText("Portfolio Name");
  fireEvent.change(portfolioSelect, { target: { value: "Fund Banana" } });

  const combos_facility = await screen.findByLabelText("Facility Name");
  const options_facility =
    await within(combos_facility).findAllByRole("option");
  const facilityText = options_facility.map((opt) => opt.textContent);

  expect(facilityText).toEqual([
    "Choose a Facility",
    "Happy Bank Banana Facility",
    "Tree Bank Fund Banana",
  ]);
});

// UT7: Unit Test to determine:
// 1 - If, after data is imported from /api/borrowbase/ it is formatted correctly
// by the series of formatting statements

// 

test("UT-7: Borrowing base line item data is formatted correctly after loading from API", async () => {

  axios.get.mockResolvedValueOnce({
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

  axios.get.mockResolvedValueOnce({
    data: [
      {
        "collateral_id": 100,
        "inclusion_date": "2023-11-30T05:00:00.000Z",
        "removed_date": null,
        "approval_date": "2025-10-15T05:00:00.000Z",
        "approved_ebitda": "15000000.00",
        "approved_net_leverage": "6.15000000",
        "approved_int_coverage": "1.25000000",
        "approved_advance_rate": "0.60000000",
        "approved_valuation": "0.95000000",
        "approved_leverage": "4.25000000",
        "commitment_amount": "7500000.00",
        "outstanding_amount": "7500000.00",
        "lien_type": "Second",
        "maturity_date": "2028-08-10T04:00:00.000Z",
        "tranche_type": "Term",
        "loan_agreement_date": "2023-10-11T04:00:00.000Z",
        "legal_name": "Test Company A",
        "short_name": "TestCo",
        "ebitda": "45222222.22",
        "start_date": "2023-08-10T04:00:00.000Z",
        "int_coverage_ratio": "0.5454",
        "is_cov_default": false,
        "is_payment_default": false,
        "leverage_ratio": "4.48548",
        "loan_metrics_id": 454,
        "net_leverage_ratio": "7.45451",
        "end_date": "2028-06-10T04:00:00.000Z",
        "fixed_rate": null,
        "floor": null,
        "has_floor": false,
        "is_fixed": false,
        "reference_rate": "LIBOR",
        "spread": "0.10450000"
    },
    {
        "collateral_id": 101,
        "inclusion_date": "2023-08-10T05:00:00.000Z",
        "removed_date": null,
        "approval_date": "2023-07-11T05:00:00.000Z",
        "approved_ebitda": "40000000.00",
        "approved_net_leverage": "1.65000000",
        "approved_int_coverage": "5.00000000",
        "approved_advance_rate": null,
        "approved_valuation": "1.0000000",
        "approved_leverage": "2.40000000",
        "commitment_amount": "56000000.00",
        "outstanding_amount": "56000000.00",
        "lien_type": "Second",
        "maturity_date": "2029-03-01T04:00:00.000Z",
        "tranche_type": "Term",
        "loan_agreement_date": "2024-03-01T04:00:00.000Z",
        "legal_name": "Test No 2",
        "short_name": "Test2",
        "ebitda": "45000000.00",
        "start_date": "2024-10-01T04:00:00.000Z",
        "int_coverage_ratio": "6.100000",
        "is_cov_default": false,
        "is_payment_default": false,
        "leverage_ratio": "1.485458",
        "loan_metrics_id": 245,
        "net_leverage_ratio": "1.06481",
        "end_date": "2029-01-01T04:00:00.000Z",
        "fixed_rate": "0.09500000",
        "floor": null,
        "has_floor": false,
        "is_fixed": true,
        "reference_rate": "",
        "spread": null
    },
    
    ],
  });

  render(<BorrowBaseLineItemView />);

  // The waitFor statements on this page are to remedy multiple problems that arose from 
  // timing issues with the test code executing and react rendering components.
  // By waiting for the "expect" condition before proceeding, the code ensures that
  // there are components rendered on which to run the tests.

  await waitFor(() => {
    const portfolioSelect = screen.getByLabelText("Portfolio Name");
    const options = within(portfolioSelect).getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  const portfolioSelect = screen.getByLabelText("Portfolio Name");
  fireEvent.change(portfolioSelect, { target: { value: "Fund Banana" } });

  await waitFor(() => {
    const facilityNameDropdown=screen.getByLabelText("Facility Name");
    const options = within(facilityNameDropdown).getAllByRole("option");
    expect(options).toHaveLength(3);
  })


  const combos_facility = await screen.findByLabelText("Facility Name");
  fireEvent.change(combos_facility, { target: { value: "Happy Bank Banana Facility" } });;

  const inputDate = screen.getByLabelText("Select As Of Date:");
  fireEvent.change(inputDate, { target: {value: "2025-06-30"}});

  await waitFor(() => {
    const grid = screen.getByRole("grid");
    const gridRows = within(grid).getAllByRole("row");
    expect(gridRows.length).toBeGreaterThan(1);

  })


  const grid = screen.getByRole("grid");
  const gridRows = within(grid).getAllByRole("row");
  const cellsRow = within(gridRows[1]).getAllByRole("gridcell");

  expect(cellsRow[0]).toHaveTextContent("100");
  expect(cellsRow[1]).toHaveTextContent("11/30/2023");
  expect(cellsRow[2]).toBeNull;
  expect(cellsRow[3]).toHaveTextContent("10/15/2025");
  expect(cellsRow[4]).toHaveTextContent("$15,000,000.00");
  expect(cellsRow[5]).toHaveTextContent("6.1500");
  expect(cellsRow[6]).toHaveTextContent("1.2500");
  expect(cellsRow[7]).toHaveTextContent("60.00%");
  expect(cellsRow[8]).toHaveTextContent("95.00%");
  expect(cellsRow[9]).toHaveTextContent("4.2500");
  expect(cellsRow[10]).toHaveTextContent("$15,000,000.00");
  expect(cellsRow[11]).toHaveTextContent("$7,500,000.00");
  expect(cellsRow[12]).toHaveTextContent("$7,500,000.00");
  expect(cellsRow[13]).toHaveTextContent("Second"); 
  expect(cellsRow[14]).toHaveTextContent("8/10/2028");
  expect(cellsRow[15]).toHaveTextContent("Term");
  expect(cellsRow[16]).toHaveTextContent("10/11/2023");
  expect(cellsRow[17]).toHaveTextContent("Test Company A");
  expect(cellsRow[18]).toHaveTextContent("TestCo"); 
  expect(cellsRow[19]).toHaveTextContent("45,222,222.22"); 
  expect(cellsRow[20]).toHaveTextContent("8/10/2023"); 
  expect(cellsRow[21]).toHaveTextContent("0.5454"); 
  expect(cellsRow[22]).toBeNull;
  expect(cellsRow[23]).toBeNull;
  expect(cellsRow[24]).toHaveTextContent("4.4855"); 
  expect(cellsRow[25]).toHaveTextContent("454"); 
  expect(cellsRow[26]).toHaveTextContent("7.4545"); 
  expect(cellsRow[27]).toHaveTextContent("8/10/2023"); 
  expect(cellsRow[28]).toHaveTextContent("6/10/2028"); 
  expect(cellsRow[29]).toBeNull;
  expect(cellsRow[30]).toBeNull;
  expect(cellsRow[31]).toBeNull;
  expect(cellsRow[32]).toBeNull;
  expect(cellsRow[33]).toHaveTextContent("LIBOR"); 
  expect(cellsRow[34]).toHaveTextContent("10.45%"); 
});