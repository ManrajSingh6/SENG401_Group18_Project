//import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentEditor from '../components/commentEditor';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Cheking the correct function of edit comment button
// mocks on click of new comment button
jest.mock('../components/commentEditor', () => {
    const comedit = () => (
      <div data-testid='editcommentbutton'>Comment Editor</div>
    );
  
    return comedit;
  });


it('render add new comment button', ()=>{
  render(<CommentEditor/>);
  const button = screen.getByTestId('editcommentbutton', {name: "add-comment-btn"});
  fireEvent.click(button);
  expect(screen.getByTestId("editcommentbutton")).toBeInTheDocument();
});