// ********************************************************************************************
// *     UT-119 – Ensure dashboard page pie charts populate after making selections and       *
// *     clicking on Generate Dashboard and that inputs format correctly                      *
// ********************************************************************************************

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { fireEvent } from "@testing-library/react";

const mockPieChart = jest.fn((props) => (
  <div data-testid="pie-chart">{props.series[0].data ? "Chart rendered" : "No data"}</div>
));

jest.mock("@mui/x-charts/PieChart", () => ({
  PieChart: (props) => mockPieChart(props),
}));

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
            portfolio_name: "Fund C",
            debt_facility_name: "Skyrim Debt Facility",
            debt_facility_id: 201,
            lender_name: "Happy Bank",
            outstanding_amount: "40000000.00",
            overall_commitment_amount: "110000000.00",
          },
        ],
      });
    }

    if (url.includes("pieChartCalculations")) {
      return Promise.resolve({
        data: [
          {
            collateralId: 150,
            collateralName: "Buttercup & Bramble Ltd.",
            valuationPercentage: 0.9,
            outstandingBalance: 10850000,
            valuation: 9765000,
            lienType: "First Lien",
            corpHQId: 5,
            corpHQRegionName: "Western Europe",
            revRegionID: 8,
            revRegionName: "Middle East",
            naicsCode: 111,
            naicsSubsector: "Crop Production",
            isPublic: "Public",
          },

          {
            collateralId: 153,
            collateralName: "Elfwood Delights",
            valuationPercentage: 0.89,
            outstandingBalance: 15000000,
            valuation: 13350000,
            lienType: "Second Lien",
            corpHQId: 2,
            corpHQRegionName: "Western Europe",
            revRegionID: 12,
            revRegionName: "Japan",
            naicsCode: 211,
            naicsSubsector: "Oil and Gas Extraction",
            isPublic: "Private",
          },
          {
            collateralId: 999,
            collateralName: null,
            valuationPercentage: 0.78,
            outstandingBalance: 5000000,
            valuation: 3900000,
            lienType: "Second Lien",
            corpHQId: 2,
            corpHQRegionName: "Canada",
            revRegionID: 8,
            revRegionName: "Middle East",
            naicsCode: 211,
            naicsSubsector: "Oil and Gas Extraction",
            isPublic: "Private",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<Dashboard />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/facilities");
  });

  // Test Selecting Portfolio Name
  const portfolioNameInput = screen.getByLabelText("Portfolio Name *");
  fireEvent.mouseDown(portfolioNameInput);
  fireEvent.click(screen.getByText("Fund C"));
  expect(portfolioNameInput.value).toBe("Fund C");

  // Test Selecting Facility Name
  const facilityNameInput = screen.getByLabelText("Facility Name *");
  fireEvent.mouseDown(facilityNameInput);
  fireEvent.click(screen.getByText("Skyrim Debt Facility"));
  expect(facilityNameInput.value).toBe("Skyrim Debt Facility");

  // Test Selecting As Of Date
  const asOfDateInput = screen.getByLabelText("As Of Date", {
    selector: "input",
  });
  fireEvent.change(asOfDateInput, { target: { value: "05/31/2025" } });
  expect(asOfDateInput.value).toBe("05/31/2025");

  const genButton = screen.getByText("Generate Dashboard");
  fireEvent.click(genButton);

  await waitFor(() => {
    expect(mockPieChart).toHaveBeenCalled();
  });

  const chartCalls = mockPieChart.mock.calls;

  const lienChartData = chartCalls[0][0];
  const naicsChartData = chartCalls[1][0];
  const hqChartData = chartCalls[2][0];
  const revRegionData = chartCalls[3][0];
  const publicPrivateData = chartCalls[4][0];

  const lienItems = lienChartData.series[0].data;
  const naicsChartItems = naicsChartData.series[0].data;
  const hqChartItems = hqChartData.series[0].data;
  const revRegionItems = revRegionData.series[0].data;
  const publicPrivateItems = publicPrivateData.series[0].data;

  expect(lienItems).toEqual(
    expect.arrayContaining([
      { label: "First Lien", value: 9765000 },
      { label: "Second Lien", value: 17250000 },
    ]),
  );

  expect(naicsChartItems).toEqual(
    expect.arrayContaining([
      { label: "Crop Production", value: 9765000 },
      { label: "Oil and Gas Extraction", value: 17250000 },
    ]),
  );

  expect(hqChartItems).toEqual(
    expect.arrayContaining([
      { label: "Western Europe", value: 23115000 },
      { label: "Canada", value: 3900000 },
    ]),
  );

  expect(revRegionItems).toEqual(
    expect.arrayContaining([
      { label: "Japan", value: 13350000 },
      { label: "Middle East", value: 13665000 },
    ]),
  );

  expect(publicPrivateItems).toEqual(
    expect.arrayContaining([
      { label: "Public", value: 9765000 },
      { label: "Private", value: 17250000 },
    ]),
  );
});
