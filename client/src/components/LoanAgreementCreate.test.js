// ************************************************************************************************
// *     UT-26 – Populating borrowers from API call - /api/borrowerquery                           *
// *     UT-27 - Testing PUT API Call to createloanagreement after filling out form               *
// *     UT-28 – Populating search options from API call -- Borrower Name but with some null data *
// ************************************************************************************************

import axios from "axios";
import { render, screen, within, waitFor } from "@testing-library/react";
import LoanAgreementCreate from "./LoanAgreementCreate";
import { fireEvent } from "@testing-library/react";

jest.mock("axios");

process.env.REACT_APP_BACKEND_URL = "http://localhost:3000";

beforeEach(() => {
  jest.clearAllMocks();
});

test("UT-26 – Populating borrower dropdown from API call -- /api/borrowerquery", async () => {
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

  render(<LoanAgreementCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  const borrowerName = screen.getByLabelText("Borrower Name *");

  fireEvent.mouseDown(borrowerName);

  expect(screen.getByText("Megaman Company")).toBeInTheDocument();
});

test("UT-27 - Testing PUT API Call to createloanagreement after filling out form", async () => {
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

  render(<LoanAgreementCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  // Find "Borrwer Name" and select "Megaman Company"
  const borrowerAutocomplete = screen.getByLabelText("Borrower Name *");
  fireEvent.mouseDown(borrowerAutocomplete);
  fireEvent.click(screen.getByText("Megaman Company"));
  expect(borrowerAutocomplete.value).toBe("Megaman Company");

  // Find Loan Agreement Title and input name
  const loanAgreementInput = screen.getByLabelText("Loan Agreement Title *");
  fireEvent.change(loanAgreementInput, {
    target: { value: "The Megaman Company Term Loan Agreement" },
  });
  expect(loanAgreementInput.value).toBe(
    "The Megaman Company Term Loan Agreement",
  );

  const loanAgreementDate = screen.getByLabelText("Loan Agreement Date *", {
    selector: "input",
  });
  fireEvent.change(loanAgreementDate, { target: { value: "10/31/2025" } });
  expect(loanAgreementDate.value).toBe("10/31/2025");

  // mock axios post so that the output can be tested upon a save
  axios.post.mockResolvedValueOnce({ status: 201 });

  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("createloanagreement"),
      expect.objectContaining({
        loanAgreementName: "The Megaman Company Term Loan Agreement",
        borrowerId: "801",
        loanAgreementDate: "2025-10-31",
      }),
    );
  });

  // simulate cancel click
  const cancelButton = screen.getByText("Cancel");
  fireEvent.click(cancelButton);
  expect(borrowerAutocomplete.value).toBe("");
  expect(loanAgreementInput.value).toBe("");
  expect(loanAgreementDate.value).toBe("");
});

test("UT-28 – Populating search options from API call -- Borrower Name but with some null data", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("borrowerquery")) {
      return Promise.resolve({
        data: [
          {
            borrower_id: "800",
          },
          {
            legal_name: "Megaman Company",
            borrower_id: "801",
          },
          {
            borrower_id: "803",
          },
        ],
      });
    }

    return Promise.resolve({ data: [] });
  });

  render(<LoanAgreementCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });

  const borrowerName = screen.getByLabelText("Borrower Name *");

  fireEvent.mouseDown(borrowerName);

  expect(screen.getByText("Megaman Company")).toBeInTheDocument();
});


test("UT-58 - Testing error for missing agreement data", async () => {
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

  render(<LoanAgreementCreate />);

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/borrowerquery",
    );
  });
  
  // simulate save click
  const saveButton = screen.getByText("Save");
  fireEvent.click(saveButton);

  const errorMessage = screen.getByText(
    "Not Saved - Please fill out all required fields - denoted by *",
  );
  expect(errorMessage).toBeVisible();


});