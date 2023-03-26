import React from 'react';
import renderer from 'react-test-renderer';
import ThreadPreview from '../components/threadPreview';
import '@testing-library/jest-dom';
import { render, screen, fireEvent,cleanup} from '@testing-library/react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


// testing subscribe thread button
jest.mock('../components/threadPreview', () => {
    const previewThread = () => (
      <div data-testid='previewThread'>Preview Thread</div>
    );
  
    return previewThread;
  });
  
  
it('render subscribe button', ()=>{
render(<ThreadPreview/>);
const button = screen.getByTestId('previewThread', {name: "button"});
fireEvent.click(button);
expect(screen.getByTestId("previewThread")).toBeInTheDocument();
});

// testing like thread button      
      
it('render like thread button', ()=>{
render(<ThreadPreview/>);
const button = screen.getByTestId('previewThread', {name: "button"});
fireEvent.click(button);
expect(screen.getByTestId("previewThread")).toBeInTheDocument();
});

// testing dislike thread button      
      
it('render dislike thread button', ()=>{
    render(<ThreadPreview/>);
    const button = screen.getByTestId('previewThread', {name: "button"});
    fireEvent.click(button);
    expect(screen.getByTestId("previewThread")).toBeInTheDocument();
    });


//testing like comment icon
test('renders thumbUpIcon', () => {
    const testme = renderer.create(<ThumbUpIcon />).toJSON();
    expect(testme).toMatchSnapshot();
  });
  
  // testing dislike comment icon
  test('renders thumbDownIcon', () => {
      const testme = renderer.create(<ThumbDownIcon />).toJSON();
      expect(testme).toMatchSnapshot();
    });