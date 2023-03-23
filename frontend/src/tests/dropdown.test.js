import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown from '../components/dropdown';

// for most likes
test("render dropdown testing for Most Likes", async () => {
  render(<Dropdown />);

  // Click on the MUI "select" (as found by the label).
  const selectLabel = /Sort/i;
  const selectEl = await screen.findByLabelText(selectLabel);

  expect(selectEl).toBeInTheDocument();

  userEvent.click(selectEl);

  // Locate the corresponding popup (`listbox`) of options.
  const optionsPopupEl = await screen.findByRole("listbox", {
    name: selectLabel
  });

  // Click an option in the popup.
  userEvent.click(within(optionsPopupEl).getByText(/Most Likes/i));

  // Confirm the outcome.
  expect(
    await screen.findByText(/Most Likes/i)
  ).toBeInTheDocument();
});

//for most posts
test("render dropdown testing for Most Posts", async () => {
    render(<Dropdown />);
  
    // Click on the MUI "select" (as found by the label).
    const selectLabel = /Sort/i;
    const selectEl = await screen.findByLabelText(selectLabel);
  
    expect(selectEl).toBeInTheDocument();
  
    userEvent.click(selectEl);
  
    // Locate the corresponding popup (`listbox`) of options.
    const optionsPopupEl = await screen.findByRole("listbox", {
      name: selectLabel
    });
  
    // Click an option in the popup.
    userEvent.click(within(optionsPopupEl).getByText(/Most Posts/i));
  
    // Confirm the outcome.
    expect(
      await screen.findByText(/Most Posts/i)
    ).toBeInTheDocument();
  });

//for most Recent
test("render dropdown testing for Most Recent", async () => {
    render(<Dropdown />);
  
    // Click on the MUI "select" (as found by the label).
    const selectLabel = /Sort/i;
    const selectEl = await screen.findByLabelText(selectLabel);
  
    expect(selectEl).toBeInTheDocument();
  
    userEvent.click(selectEl);
  
    // Locate the corresponding popup (`listbox`) of options.
    const optionsPopupEl = await screen.findByRole("listbox", {
      name: selectLabel
    });
  
    // Click an option in the popup.
    userEvent.click(within(optionsPopupEl).getByText(/Most Recent/i));
  
    // Confirm the outcome.
    expect(
      await screen.findByText(/Most Recent/i)
    ).toBeInTheDocument();
  });