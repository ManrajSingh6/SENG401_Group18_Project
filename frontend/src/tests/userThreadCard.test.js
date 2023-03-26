import React from 'react';
import renderer from 'react-test-renderer';
import ThreadCard from '../components/userThreadCard';
import '@testing-library/jest-dom';
import { render, screen, fireEvent,cleanup} from '@testing-library/react';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ArticleIcon from '@mui/icons-material/Article';


// testing delete button
jest.mock('../components/userThreadCard', () => {
    const threadCard = () => (
      <div data-testid='threadCard'>user thread card</div>
    );
  
    return threadCard;
  });
  
  
it('Confirm deletion button', ()=>{
render(<ThreadCard/>);
const button = screen.getByTestId('threadCard', {name: "button"});
fireEvent.click(button);
expect(screen.getByTestId("threadCard")).toBeInTheDocument();
});

//testing like icon
test('renders ThumbUpRoundedIcon', () => {
    const testme = renderer.create(<ThumbUpRoundedIcon />).toJSON();
    expect(testme).toMatchSnapshot();
  });
  
  // testing comment icon
  test('renders ArticleIcon', () => {
      const testme = renderer.create(<ArticleIcon />).toJSON();
      expect(testme).toMatchSnapshot();
    });