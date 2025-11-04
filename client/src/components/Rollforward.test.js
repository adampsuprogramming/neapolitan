// ********************************************************************************************
// *     UT-74 – Ensure rollforward page can populate after making selections and clicking    *
// *     generate and inputs format correctly                                                 *
// *     UT-75 – Test error handling for failed facility data retrieval                       *
// *     UT-76 - Test error handling for failed rollforward retrieval                         *
// ********************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import Rollforward from "./Rollforward";
import { fireEvent } from "@testing-library/react";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: [] })),
}));

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-74: Ensure reporting page can populate after making selections and inputs format properly with Funds Flow Selected", async () => {
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

    if (url.includes("reportingCalculations")) {
      return Promise.resolve({
        data: {
          collateralData: [
            {
              collateralId: 1,
              collateralName: "Loan A",
              balanceBeg: 10000000,
              collAdded: 0,
              collRemoved: 0,
              principalRec: -500000,
              balanceEnd: 9500000,
              begValue: 9800000,
              chgDueToAdd: 0,
              chgDueToRepay: -490000,
              chgDueToInternalVal: -285000.0,
              addlChgBankVal: 0.0,
              endValue: 9025000,
              begLevAvail: 6370000,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: -318500.0,
              levAvailChgDueToVal: -185250.0,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 5866250,
              bankValBeg: 0.98,
              bankValEnd: 0.98,
              internalValBeg: 0.98,
              internalValEnd: 0.95,
              advanceRateBeg: 0.65,
              advanceRateEnd: 0.65,
              intRec: 200000,
            },
            {
              collateralId: 2,
              collateralName: "Loan B",
              balanceBeg: 15000000,
              collAdded: 0,
              collRemoved: 0,
              principalRec: -1000000,
              balanceEnd: 14000000,
              begValue: 13500000,
              chgDueToAdd: 0,
              chgDueToRepay: -900000,
              chgDueToInternalVal: 699999.9999999991,
              addlChgBankVal: -2099999.999999999,
              endValue: 11200000,
              begLevAvail: 5400000,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: -360000.0,
              levAvailChgDueToVal: -560000.0,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 4480000,
              bankValBeg: 0.9,
              bankValEnd: 0.8,
              internalValBeg: 0.95,
              internalValEnd: 0.95,
              advanceRateBeg: 0.4,
              advanceRateEnd: 0.4,
              intRec: 300000,
            },
            {
              collateralId: 3,
              collateralName: "Loan C",
              balanceBeg: 12000000,
              collAdded: 0,
              collRemoved: 0,
              principalRec: -200000,
              balanceEnd: 11800000,
              begValue: 11640000,
              chgDueToAdd: 0,
              chgDueToRepay: -194000,
              chgDueToInternalVal: 354000.0000000003,
              addlChgBankVal: -472000.0000000004,
              endValue: 11328000,
              begLevAvail: 4656000,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: -77600.0,
              levAvailChgDueToVal: -47200.00000000005,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 4531200,
              bankValBeg: 0.97,
              bankValEnd: 0.96,
              internalValBeg: 1.0,
              internalValEnd: 1.0,
              advanceRateBeg: 0.4,
              advanceRateEnd: 0.4,
              intRec: 100000,
            },
            {
              collateralId: 4,
              collateralName: "Loan D",
              balanceBeg: 9000000,
              collAdded: 0,
              collRemoved: 0,
              principalRec: 0,
              balanceEnd: 9000000,
              begValue: 8865000,
              chgDueToAdd: 0,
              chgDueToRepay: 0,
              chgDueToInternalVal: -315000.0000000003,
              addlChgBankVal: 0.0,
              endValue: 8550000,
              begLevAvail: 5762250,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: 0.0,
              levAvailChgDueToVal: -204750.0000000002,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 5557500,
              bankValBeg: 0.985,
              bankValEnd: 0.985,
              internalValBeg: 1.0,
              internalValEnd: 0.95,
              advanceRateBeg: 0.65,
              advanceRateEnd: 0.65,
              intRec: 150000,
            },
            {
              collateralId: 5,
              collateralName: "Loan E",
              balanceBeg: 7000000,
              collAdded: 0,
              collRemoved: -6750000,
              principalRec: -250000,
              balanceEnd: 0,
              begValue: 5950000,
              chgDueToAdd: 0,
              chgDueToRepay: -5950000,
              chgDueToInternalVal: 0.0,
              addlChgBankVal: 0.0,
              endValue: 0,
              begLevAvail: 2975000,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: -2975000.0,
              levAvailChgDueToVal: 0.0,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 0,
              bankValBeg: 0.85,
              bankValEnd: 0.9,
              internalValBeg: 0.97,
              internalValEnd: 1.0,
              advanceRateBeg: 0.5,
              advanceRateEnd: 0.4,
              intRec: 180000,
            },
            {
              collateralId: 6,
              collateralName: "Loan F",
              balanceBeg: 10000000,
              collAdded: 0,
              collRemoved: 0,
              principalRec: -1000000,
              balanceEnd: 9000000,
              begValue: 9000000,
              chgDueToAdd: 0,
              chgDueToRepay: -900000,
              chgDueToInternalVal: 0.0,
              addlChgBankVal: 0.0,
              endValue: 8100000,
              begLevAvail: 4950000,
              levAvailChgDueToAddition: 0,
              levAvailChgDueToRepay: -495000.00000000006,
              levAvailChgDueToVal: 0.0,
              levAvailChgDueToAdvRate: -405000,
              endLevAvail: 4050000,
              bankValBeg: 0.9,
              bankValEnd: 0.9,
              internalValBeg: 0.9,
              internalValEnd: 0.9,
              advanceRateBeg: 0.55,
              advanceRateEnd: 0.5,
              intRec: 400000,
            },
            {
              collateralId: 7,
              collateralName: "Loan G",
              balanceBeg: 0,
              collAdded: 11000000,
              collRemoved: 0,
              principalRec: -100000,
              balanceEnd: 10900000,
              begValue: 0,
              chgDueToAdd: 11000000,
              chgDueToRepay: -100000,
              chgDueToInternalVal: 0.0,
              addlChgBankVal: -545000.0000000005,
              endValue: 10355000,
              begLevAvail: 0,
              levAvailChgDueToAddition: 7150000,
              levAvailChgDueToRepay: -65000.0,
              levAvailChgDueToVal: -354250.0000000003,
              levAvailChgDueToAdvRate: 0,
              endLevAvail: 6730750,
              bankValBeg: 1.0,
              bankValEnd: 0.95,
              internalValBeg: 1.0,
              internalValEnd: 1.0,
              advanceRateBeg: 0.65,
              advanceRateEnd: 0.65,
              intRec: 300000,
            },
          ],
          fundsFlowData: {
            currFacBal: 32000000.0,
            endLevAvail: 31215700.0,
            currAvail: -784300.0,
            intExp: -125458.47,
            principalRec: 3050000.0,
            intRec: 754488.45,
            totalDist: 3804488.45,
            dueToBank: 909758.47,
            dueToClient: 2894729.9800000004,
          },
        },
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<Rollforward />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/facilities");
  });

  // Test Selecting Portfolio Name
  const portfolioNameInput = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioNameInput);
  fireEvent.click(screen.getByText("Fund Banana"));
  expect(portfolioNameInput.value).toBe("Fund Banana");

  // Test Selecting Facility Name
  const facilityNameInput = screen.getByLabelText("Facility Name *");
  fireEvent.mouseDown(facilityNameInput);
  fireEvent.click(screen.getByText("Happy Bank Banana Facility"));
  expect(facilityNameInput.value).toBe("Happy Bank Banana Facility");

  // Test Selecting Start Date
  const startDateInput = screen.getByLabelText("Start Date", {
    selector: "input",
  });
  fireEvent.change(startDateInput, { target: { value: "05/31/2025" } });
  expect(startDateInput.value).toBe("05/31/2025");

  // Test Selecting End Date
  const endDateInput = screen.getByLabelText("End Date", {
    selector: "input",
  });
  fireEvent.change(endDateInput, { target: { value: "10/31/2025" } });
  expect(endDateInput.value).toBe("10/31/2025");

  const togglePublic = screen.getByLabelText("Includes Funds Flow");
  fireEvent.click(togglePublic);
  expect(togglePublic).toBeChecked();

  const currOutstandings = screen.getByLabelText("Current Outstandings *");
  fireEvent.change(currOutstandings, {
    target: { value: "32000000" },
  });
  expect(currOutstandings.value).toBe("$32,000,000.00");

  const intExpDue = screen.getByLabelText("Interest Expense Due *");
  fireEvent.change(intExpDue, {
    target: { value: "125458" },
  });
  expect(intExpDue.value).toBe("$125,458.00");

  const genButton = screen.getByText("Generate Report");
  fireEvent.click(genButton);

  // Test Principal Received
  await waitFor(() => {
    expect(screen.getByText("Principal Received")).toBeInTheDocument();
  });

  const allTables = screen.getAllByRole("table");
  const outstandings = allTables[0];
  const value = allTables[1];
  const totalAvail = allTables[2];
  const addlData = allTables[3];

  // Test Rollforward of Outstandings

  const outstandingRows = within(outstandings).getAllByRole("row");

  expect(
    screen.getByText("Rollforward of Outstandings from 5/31/2025 to 10/31/2025"),
  ).toBeInTheDocument();

  expect(within(outstandingRows[1]).getAllByRole("cell")[0]).toHaveTextContent("Loan A");
  expect(within(outstandingRows[2]).getAllByRole("cell")[0]).toHaveTextContent("Loan B");
  expect(within(outstandingRows[7]).getAllByRole("cell")[0]).toHaveTextContent("Loan G");

  expect(within(outstandingRows[1]).getAllByRole("cell")[1]).toHaveTextContent("10,000,000");
  expect(within(outstandingRows[4]).getAllByRole("cell")[1]).toHaveTextContent("9,000,000");
  expect(within(outstandingRows[7]).getAllByRole("cell")[1]).toHaveTextContent("0");

  expect(within(outstandingRows[1]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(outstandingRows[2]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(outstandingRows[7]).getAllByRole("cell")[2]).toHaveTextContent("11,000,000");

  expect(within(outstandingRows[1]).getAllByRole("cell")[3]).toHaveTextContent("0");
  expect(within(outstandingRows[5]).getAllByRole("cell")[3]).toHaveTextContent("-6,750,000");
  expect(within(outstandingRows[8]).getAllByRole("cell")[3]).toHaveTextContent("-6,750,000");

  expect(within(outstandingRows[1]).getAllByRole("cell")[4]).toHaveTextContent("-500,000");
  expect(within(outstandingRows[3]).getAllByRole("cell")[4]).toHaveTextContent("-200,000");
  expect(within(outstandingRows[8]).getAllByRole("cell")[4]).toHaveTextContent("-3,050,000");

  expect(within(outstandingRows[1]).getAllByRole("cell")[5]).toHaveTextContent("9,500,000");
  expect(within(outstandingRows[2]).getAllByRole("cell")[5]).toHaveTextContent("14,000,000");
  expect(within(outstandingRows[7]).getAllByRole("cell")[5]).toHaveTextContent("10,900,000");

  // Test Rollforward of Value

  const valueRows = within(value).getAllByRole("row");

  expect(screen.getByText("Rollforward of Value from 5/31/2025 to 10/31/2025")).toBeInTheDocument();

  expect(within(valueRows[3]).getAllByRole("cell")[0]).toHaveTextContent("Loan C");
  expect(within(valueRows[5]).getAllByRole("cell")[0]).toHaveTextContent("Loan E");
  expect(within(valueRows[6]).getAllByRole("cell")[0]).toHaveTextContent("Loan F");

  expect(within(valueRows[2]).getAllByRole("cell")[1]).toHaveTextContent("13,500,000");
  expect(within(valueRows[3]).getAllByRole("cell")[1]).toHaveTextContent("11,640,000");
  expect(within(valueRows[7]).getAllByRole("cell")[1]).toHaveTextContent("0");

  expect(within(valueRows[3]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(valueRows[4]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(valueRows[7]).getAllByRole("cell")[2]).toHaveTextContent("11,000,000");

  expect(within(valueRows[2]).getAllByRole("cell")[3]).toHaveTextContent("-900,000");
  expect(within(valueRows[4]).getAllByRole("cell")[3]).toHaveTextContent("0");
  expect(within(valueRows[6]).getAllByRole("cell")[3]).toHaveTextContent("-900,000");

  expect(within(valueRows[1]).getAllByRole("cell")[4]).toHaveTextContent("-285,000");
  expect(within(valueRows[2]).getAllByRole("cell")[4]).toHaveTextContent("-1,400,000");
  expect(within(valueRows[8]).getAllByRole("cell")[4]).toHaveTextContent("-2,663,000");

  expect(within(valueRows[2]).getAllByRole("cell")[5]).toHaveTextContent("11,200,000");
  expect(within(valueRows[4]).getAllByRole("cell")[5]).toHaveTextContent("8,550,000");
  expect(within(valueRows[6]).getAllByRole("cell")[5]).toHaveTextContent("8,100,000");

  // Test Rollforward of Total Availability

  const totalAvailRows = within(totalAvail).getAllByRole("row");

  expect(
    screen.getByText("Rollforward of Total Availability from 5/31/2025 to 10/31/2025"),
  ).toBeInTheDocument();

  expect(within(totalAvailRows[1]).getAllByRole("cell")[0]).toHaveTextContent("Loan A");
  expect(within(totalAvailRows[3]).getAllByRole("cell")[0]).toHaveTextContent("Loan C");
  expect(within(totalAvailRows[8]).getAllByRole("cell")[0]).toHaveTextContent("Total");

  expect(within(totalAvailRows[2]).getAllByRole("cell")[1]).toHaveTextContent("5,400,000");
  expect(within(totalAvailRows[3]).getAllByRole("cell")[1]).toHaveTextContent("4,656,000");
  expect(within(totalAvailRows[5]).getAllByRole("cell")[1]).toHaveTextContent("2,975,000");

  expect(within(totalAvailRows[1]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(totalAvailRows[2]).getAllByRole("cell")[2]).toHaveTextContent("0");
  expect(within(totalAvailRows[7]).getAllByRole("cell")[2]).toHaveTextContent("7,150,000");

  expect(within(totalAvailRows[1]).getAllByRole("cell")[3]).toHaveTextContent("-318,500");
  expect(within(totalAvailRows[4]).getAllByRole("cell")[3]).toHaveTextContent("0");
  expect(within(totalAvailRows[6]).getAllByRole("cell")[3]).toHaveTextContent("-495,000");

  expect(within(totalAvailRows[3]).getAllByRole("cell")[4]).toHaveTextContent("-47,200");
  expect(within(totalAvailRows[4]).getAllByRole("cell")[4]).toHaveTextContent("-204,750");
  expect(within(totalAvailRows[8]).getAllByRole("cell")[4]).toHaveTextContent("-1,351,450");

  expect(within(totalAvailRows[6]).getAllByRole("cell")[5]).toHaveTextContent("-405,000");
  expect(within(totalAvailRows[7]).getAllByRole("cell")[5]).toHaveTextContent("0");
  expect(within(totalAvailRows[8]).getAllByRole("cell")[5]).toHaveTextContent("-405,000");

  expect(within(totalAvailRows[1]).getAllByRole("cell")[6]).toHaveTextContent("5,866,250");
  expect(within(totalAvailRows[2]).getAllByRole("cell")[6]).toHaveTextContent("4,480,000");
  expect(within(totalAvailRows[7]).getAllByRole("cell")[6]).toHaveTextContent("6,730,750");

  // Test Rollforward of Additional Data

  const addlDataRows = within(addlData).getAllByRole("row");

  expect(screen.getByText("Additional Data - 5/31/2025 / 10/31/2025")).toBeInTheDocument();

  expect(within(addlDataRows[2]).getAllByRole("cell")[0]).toHaveTextContent("Loan B");
  expect(within(addlDataRows[5]).getAllByRole("cell")[0]).toHaveTextContent("Loan E");
  expect(within(addlDataRows[7]).getAllByRole("cell")[0]).toHaveTextContent("Loan G");

  expect(within(addlDataRows[1]).getAllByRole("cell")[1]).toHaveTextContent("98.00%");
  expect(within(addlDataRows[2]).getAllByRole("cell")[1]).toHaveTextContent("90.00%");
  expect(within(addlDataRows[6]).getAllByRole("cell")[1]).toHaveTextContent("90.00%");

  expect(within(addlDataRows[3]).getAllByRole("cell")[2]).toHaveTextContent("96.00%");
  expect(within(addlDataRows[4]).getAllByRole("cell")[2]).toHaveTextContent("98.50%");
  expect(within(addlDataRows[5]).getAllByRole("cell")[2]).toHaveTextContent("90.00%");

  expect(within(addlDataRows[2]).getAllByRole("cell")[3]).toHaveTextContent("95.00%");
  expect(within(addlDataRows[3]).getAllByRole("cell")[3]).toHaveTextContent("100.00%");
  expect(within(addlDataRows[5]).getAllByRole("cell")[3]).toHaveTextContent("97.00%");

  expect(within(addlDataRows[1]).getAllByRole("cell")[4]).toHaveTextContent("95.00%");
  expect(within(addlDataRows[2]).getAllByRole("cell")[4]).toHaveTextContent("95.00%");
  expect(within(addlDataRows[7]).getAllByRole("cell")[4]).toHaveTextContent("100.00%");

  expect(within(addlDataRows[3]).getAllByRole("cell")[5]).toHaveTextContent("40.00%");
  expect(within(addlDataRows[4]).getAllByRole("cell")[5]).toHaveTextContent("65.00%");
  expect(within(addlDataRows[6]).getAllByRole("cell")[5]).toHaveTextContent("55.00%");

  expect(within(addlDataRows[3]).getAllByRole("cell")[6]).toHaveTextContent("40.00%");
  expect(within(addlDataRows[4]).getAllByRole("cell")[6]).toHaveTextContent("65.00%");
  expect(within(addlDataRows[6]).getAllByRole("cell")[6]).toHaveTextContent("50.00%");

  expect(within(addlDataRows[1]).getAllByRole("cell")[7]).toHaveTextContent("200,000");
  expect(within(addlDataRows[2]).getAllByRole("cell")[7]).toHaveTextContent("300,000");
  expect(within(addlDataRows[5]).getAllByRole("cell")[7]).toHaveTextContent("180,000");

  // Test funds flow box
  expect(screen.getByText("Funds Flow from 5/31/2025 to 10/31/2025")).toBeInTheDocument();
  expect(screen.getByText("32,000,000")).toBeInTheDocument();
  expect(screen.getByText("-125,458")).toBeInTheDocument();
  expect(screen.getByText("909,758")).toBeInTheDocument();
  expect(screen.getByText("2,894,730")).toBeInTheDocument();

  // Test cancel button
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);

  expect(portfolioNameInput.value).toBe("");
  expect(facilityNameInput.value).toBe("");
  expect(startDateInput.value).toBe("");
  expect(endDateInput.value).toBe("");
});

test("UT-75: Test error handling for facility data retrieval", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("facilities")) {
      return Promise.reject({
        status: 500,
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<Rollforward />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/facilities",
    );
  });

  expect(screen.getByText("Error fetching facility data")).toBeInTheDocument();
});

test("UT-76: Test error handling for roll forward data fetching", async () => {
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

    if (url.includes("reportingCalculations")) {
      return Promise.reject({
        status: 500,
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<Rollforward />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:5000/api/facilities",
    );
  });

  // Test Selecting Portfolio Name
  const portfolioNameInput = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioNameInput);
  fireEvent.click(screen.getByText("Fund Banana"));
  expect(portfolioNameInput.value).toBe("Fund Banana");

  // Test Selecting Facility Name
  const facilityNameInput = screen.getByLabelText("Facility Name *");
  fireEvent.mouseDown(facilityNameInput);
  fireEvent.click(screen.getByText("Happy Bank Banana Facility"));
  expect(facilityNameInput.value).toBe("Happy Bank Banana Facility");

  // Test Selecting Start Date
  const startDateInput = screen.getByLabelText("Start Date", {
    selector: "input",
  });
  fireEvent.change(startDateInput, { target: { value: "05/31/2025" } });
  expect(startDateInput.value).toBe("05/31/2025");

  // Test Selecting End Date
  const endDateInput = screen.getByLabelText("End Date", {
    selector: "input",
  });
  fireEvent.change(endDateInput, { target: { value: "10/31/2025" } });
  expect(endDateInput.value).toBe("10/31/2025");

  const togglePublic = screen.getByLabelText("Includes Funds Flow");
  fireEvent.click(togglePublic);
  expect(togglePublic).toBeChecked();

  const currOutstandings = screen.getByLabelText("Current Outstandings *");
  fireEvent.change(currOutstandings, {
    target: { value: "32000000" },
  });
  expect(currOutstandings.value).toBe("$32,000,000.00");

  const intExpDue = screen.getByLabelText("Interest Expense Due *");
  fireEvent.change(intExpDue, {
    target: { value: "125,458" },
  });
  expect(intExpDue.value).toBe("$125,458.00");

  const genButton = screen.getByText("Generate Report");
  fireEvent.click(genButton);

  await waitFor(() => {
    expect(screen.getByText("Error fetching rollforward data")).toBeInTheDocument();
  });
});
