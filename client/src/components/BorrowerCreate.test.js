// **********************************************************************************
// *     UT-18 – Populating options for Region from API call (HQ)                   *
// *     UT-19 – Populating options for Region from API call (Rev)                  *
// *     UT-20 – Populating options for NAICS subsector from API call               *
// *     UT-21 - Testing PUT API Call After Filling in Data from Form               *
// *     UT-22 - Testing handling null values received for NAICS subsector API Call *
// *     UT-23 - Testing handling null values received for Region (HQ) API Call     *
// *     UT-24 - Testing handling null values received for Region (Rev) API Call    *
// *     UT-57 - Testing error for missing borrower data                            *
// **********************************************************************************

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import BorrowerCreate from "./BorrowerCreate";
import { fireEvent } from "@testing-library/react";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:5000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-18 – Populating search options from API call -- selectedCorpHQId", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("regionquery")) {
      return Promise.resolve({
        data: [
          {
            region_name: "Narnia",
            region_id: "20",
          },
          {
            region_name: "Labrynth",
            region_id: "21",
          },
          {
            region_name: "Middle Earth",
            region_id: "22",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/regionquery");
  });

  const corpHQ = screen.getByLabelText("Corporate Headquarters *");

  fireEvent.mouseDown(corpHQ);

  expect(screen.getByText("Middle Earth")).toBeInTheDocument();
});

test("UT-19 – Populating search options from API call -- selectedRevRegion", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("regionquery")) {
      return Promise.resolve({
        data: [
          {
            region_name: "Narnia",
            region_id: "20",
          },
          {
            region_name: "Labrynth",
            region_id: "21",
          },
          {
            region_name: "Middle Earth",
            region_id: "22",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/regionquery");
  });

  const revGeography = screen.getByLabelText("Primary Geography (Revenue) *");

  fireEvent.mouseDown(revGeography);

  expect(screen.getByText("Narnia")).toBeInTheDocument();
});

test("UT-20 – Populating search options from API call -- NAICS subsector", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("subsectorquery")) {
      return Promise.resolve({
        data: [
          {
            naics_subsector_name: "Video Games Production",
            naics_subsector_id: "111",
          },
          {
            naics_subsector_name: "Croissant Making",
            naics_subsector_id: "222",
          },
          {
            naics_subsector_name: "Improv Comedy",
            naics_subsector_id: "333",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/subsectorquery");
  });

  const naicsSubsector = screen.getByLabelText("NAICS Subsector Code *");

  fireEvent.mouseDown(naicsSubsector);

  expect(screen.getByText("333 - Improv Comedy")).toBeInTheDocument();
});

test("UT-21 - Testing PUT API Call to Borrower After Filling in Data from Form", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("regionquery")) {
      return Promise.resolve({
        data: [
          {
            region_name: "Narnia",
            region_id: "20",
          },
          {
            region_name: "Labyrinth",
            region_id: "21",
          },
          {
            region_name: "Middle Earth",
            region_id: "22",
          },
        ],
      });
    }

    if (url.includes("subsectorquery")) {
      return Promise.resolve({
        data: [
          {
            naics_subsector_name: "Video Games Production",
            naics_subsector_id: "111",
          },
          {
            naics_subsector_name: "Croissant Making",
            naics_subsector_id: "222",
          },
          {
            naics_subsector_name: "Improv Comedy",
            naics_subsector_id: "333",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] }); // Catchall
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/regionquery");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/subsectorquery");
  });

  // Find borrower name and input borrower
  const borrowerLongNameInput = screen.getByLabelText("Borrower Name *");
  fireEvent.change(borrowerLongNameInput, {
    target: { value: "The BioShock Company" },
  });
  expect(borrowerLongNameInput.value).toBe("The BioShock Company");

  // Find borrower nickname and input borrower nickname
  const borrowerNickNameInput = screen.getByLabelText("Borrower Nickname");
  fireEvent.change(borrowerNickNameInput, {
    target: { value: "BioShock Co." },
  });
  expect(borrowerNickNameInput.value).toBe("BioShock Co.");

  // Find autocomplete box for Corporate HQ and Select
  const corpHqAutocomplete = screen.getByLabelText("Corporate Headquarters *");
  fireEvent.mouseDown(corpHqAutocomplete);
  fireEvent.click(screen.getByText("Labyrinth"));
  expect(corpHqAutocomplete.value).toBe("Labyrinth");

  // Find autocomplete box for Primary Geography (Revenue) and Select
  const primaryGeoRevAutocomplete = screen.getByLabelText("Primary Geography (Revenue) *");
  fireEvent.mouseDown(primaryGeoRevAutocomplete);
  fireEvent.click(screen.getByText("Middle Earth"));
  expect(primaryGeoRevAutocomplete.value).toBe("Middle Earth");

  // Find autocomplete box for NAICS Subsector and Select
  const naicsSubsector = screen.getByLabelText("NAICS Subsector Code *");
  fireEvent.mouseDown(naicsSubsector);
  fireEvent.click(screen.getByText("222 - Croissant Making"));
  expect(naicsSubsector.value).toBe("222 - Croissant Making");

  // Find Toggle for Public Borrower and click
  const togglePublic = screen.getByLabelText("Public Borrower");
  fireEvent.click(togglePublic);
  expect(togglePublic).toBeChecked();

  // Find Ticker Symbol and Input Text
  const tickerSymbolInput = screen.getByLabelText("Ticker Symbol *");
  fireEvent.change(tickerSymbolInput, {
    target: { value: "ABC" },
  });
  expect(tickerSymbolInput.value).toBe("ABC");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createborrower"),
      expect.objectContaining({
        legalName: "The BioShock Company",
        shortName: "BioShock Co.",
        corporateHqId: "21",
        revenueGeographyId: "22",
        naicsSubsectorId: "222",
        isPublic: true,
        tickerSymbol: "ABC",
      }),
    );
  });

  await waitFor(() => {
    expect(borrowerLongNameInput.value).toBe("");
    expect(borrowerNickNameInput.value).toBe("");
    expect(corpHqAutocomplete.value).toBe("");
    expect(primaryGeoRevAutocomplete.value).toBe("");
    expect(naicsSubsector.value).toBe("");
    expect(togglePublic).not.toBeChecked();
    expect(tickerSymbolInput.value).toBe("");
  });

  const successMessage = screen.getByText("Borrower Created Successfully");
  expect(successMessage).toBeVisible();
});

test("UT-22 – Populating search options from API call for NAICS subsector but with some null data", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("subsectorquery")) {
      return Promise.resolve({
        data: [
          {
            naics_subsector_id: "111",
          },
          {
            naics_subsector_name: "Croissant Making",
          },
          {
            naics_subsector_name: "Improv Comedy",
            naics_subsector_id: "333",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/subsectorquery");
  });

  const naicsSubsector = screen.getByLabelText("NAICS Subsector Code *");

  fireEvent.mouseDown(naicsSubsector);

  expect(screen.getByText("333 - Improv Comedy")).toBeInTheDocument();
});

test("UT-23 – Populating search options from API call for Corporate Headquarters -- but with some null data", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("regionquery")) {
      return Promise.resolve({
        data: [
          {
            region_id: "20",
          },
          {
            region_name: "Narnia",
          },
          {
            region_name: "Middle Earth",
            region_id: "22",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/regionquery");
  });

  const corpHQ = screen.getByLabelText("Corporate Headquarters *");

  fireEvent.mouseDown(corpHQ);

  expect(screen.getByText("Middle Earth")).toBeInTheDocument();
});

test("UT-57 – Testing error for missing borrower data", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("regionquery")) {
      return Promise.resolve({
        data: [
          {
            region_name: "Narnia",
            region_id: "20",
          },
          {
            region_name: "Labyrinth",
            region_id: "21",
          },
          {
            region_name: "Middle Earth",
            region_id: "22",
          },
        ],
      });
    }

    if (url.includes("subsectorquery")) {
      return Promise.resolve({
        data: [
          {
            naics_subsector_name: "Video Games Production",
            naics_subsector_id: "111",
          },
          {
            naics_subsector_name: "Croissant Making",
            naics_subsector_id: "222",
          },
          {
            naics_subsector_name: "Improv Comedy",
            naics_subsector_id: "333",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] }); // Catch all
  });

  render(<BorrowerCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/regionquery");
  });

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/subsectorquery");
  });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  const errorMessage = screen.getByText(
    "Not Saved - Please fill out all required fields - denoted by *",
  );
  expect(errorMessage).toBeVisible();
});
