// ********************************************************************************************************
// *     UT-123 – Ensure balance report page can populate after making selections and clicking Generate   *
// ********************************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import AssetBalanceReport from "./AssetBalanceReport";
import { fireEvent } from "@testing-library/react";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-123: Ensure asset balance report can populate after making selections", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("facilities")) {
      return Promise.resolve({
        data: [
          {
            portfolio_id: 1,
            portfolio_name: "Fund Apple",
            debt_facility_name: "Orchard Bank Fund Apple Facility",
            debt_facility_id: 5,
            lender_name: "Orchard Bank",
            outstanding_amount: "1234567",
            overall_commitment_amount: "1234567",
          },
          {
            portfolio_id: 2,
            portfolio_name: "Fund Banana",
            debt_facility_name: "Tree Bank Fund Banana",
            debt_facility_id: 6,
            lender_name: "Tree Bank",
            outstanding_amount: "50000000.00",
            overall_commitment_amount: "100000000.00",
          },
          {
            portfolio_id: 1,
            portfolio_name: "Fund Apple",
            debt_facility_name: "Golden Bank Fund Apple Facility",
            debt_facility_id: 7,
            lender_name: "Golden Bank",
            outstanding_amount: "5000000.00",
            overall_commitment_amount: "6000000.00",
          },
          {
            portfolio_id: 2,
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

    if (url.includes("balanceReportCalculations")) {
      return Promise.resolve({
        data: [
          [
            "Tranche Name",
            "Orchard Bank Fund Apple Facility",
            "Golden Bank Fund Apple Facility",
            "Total",
          ],
          ["Loan A", 10000000, 20000000, 30000000],
          ["Loan B", 2500000, 7500000, 10000000],
          ["Loan C", 1000000, 2000000, 3000000],
          ["Total", 13500000, 29500000, 43000000],
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<AssetBalanceReport />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/facilities");
  });

  // Test Selecting Portfolio Name
  const portfolioNameInput = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioNameInput);
  fireEvent.click(screen.getByText("Fund Apple"));
  expect(portfolioNameInput.value).toBe("Fund Apple");

  // Test Selecting As Of Date
  const asOfDateInput = screen.getByLabelText("As Of Date", {
    selector: "input",
  });
  fireEvent.change(asOfDateInput, { target: { value: "09/30/2025" } });
  expect(asOfDateInput.value).toBe("09/30/2025");

  const genButton = screen.getByText("Generate Report");
  fireEvent.click(genButton);

  await waitFor(() => {
    expect(screen.getByText("Tranche Balance By Facility - 9/30/2025")).toBeInTheDocument();
  });

  const table = screen.getByRole("table");

  const tableRows = within(table).getAllByRole("row");

  expect(screen.getByText("Tranche Balance By Facility - 9/30/2025")).toBeInTheDocument();

  expect(within(tableRows[0]).getAllByRole("columnheader")[0]).toHaveTextContent("Tranche Name");
  expect(within(tableRows[0]).getAllByRole("columnheader")[1]).toHaveTextContent(
    "Orchard Bank Fund Apple Facility",
  );
  expect(within(tableRows[0]).getAllByRole("columnheader")[2]).toHaveTextContent(
    "Golden Bank Fund Apple Facility",
  );
  expect(within(tableRows[0]).getAllByRole("columnheader")[3]).toHaveTextContent("Total");

  expect(within(tableRows[1]).getAllByRole("cell")[0]).toHaveTextContent("Loan A");
  expect(within(tableRows[1]).getAllByRole("cell")[1]).toHaveTextContent("10,000,000");
  expect(within(tableRows[1]).getAllByRole("cell")[2]).toHaveTextContent("20,000,000");
  expect(within(tableRows[1]).getAllByRole("cell")[3]).toHaveTextContent("30,000,000");

  expect(within(tableRows[2]).getAllByRole("cell")[0]).toHaveTextContent("Loan B");
  expect(within(tableRows[2]).getAllByRole("cell")[1]).toHaveTextContent("2,500,000");
  expect(within(tableRows[2]).getAllByRole("cell")[2]).toHaveTextContent("7,500,000");
  expect(within(tableRows[2]).getAllByRole("cell")[3]).toHaveTextContent("10,000,000");

  expect(within(tableRows[3]).getAllByRole("cell")[0]).toHaveTextContent("Loan C");
  expect(within(tableRows[3]).getAllByRole("cell")[1]).toHaveTextContent("1,000,000");
  expect(within(tableRows[3]).getAllByRole("cell")[2]).toHaveTextContent("2,000,000");
  expect(within(tableRows[3]).getAllByRole("cell")[3]).toHaveTextContent("3,000,000");

  expect(within(tableRows[4]).getAllByRole("cell")[0]).toHaveTextContent("Total");
  expect(within(tableRows[4]).getAllByRole("cell")[1]).toHaveTextContent("13,500,000");
  expect(within(tableRows[4]).getAllByRole("cell")[2]).toHaveTextContent("29,500,000");
  expect(within(tableRows[4]).getAllByRole("cell")[3]).toHaveTextContent("43,000,000");

  // Test cancel button
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);

  expect(portfolioNameInput.value).toBe("");
  expect(asOfDateInput.value).toBe("");
});
