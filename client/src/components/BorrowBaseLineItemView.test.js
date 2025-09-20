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

test("portfolio data correctly loads from API on page load into dropdown menu", async () => {
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

test("Facility data correctly loads into second dropdown menu after choice is made in first dropdown", async () => {
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
