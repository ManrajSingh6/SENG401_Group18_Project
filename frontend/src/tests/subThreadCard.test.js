import React from 'react';
import renderer from 'react-test-renderer';
import UnsubsConfirm from '../components/subThreadCard';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

// testing confirm unsubscribe thread button
jest.mock('../components/subThreadCard', () => {
    const unsubscribeThread = () => (
      <div data-testid='unsubscribeThread'>Unsubscribe Thread</div>
    );
  
    return unsubscribeThread;
  });
  
  
  it('render confirm unsubscribe button', ()=>{
  render(<UnsubsConfirm/>);
  const button = screen.getByTestId('unsubscribeThread', {name: "post-option-btn"});
  fireEvent.click(button);
  expect(screen.getByTestId("unsubscribeThread")).toBeInTheDocument();
  });
  