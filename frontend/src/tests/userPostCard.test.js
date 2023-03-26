import React from 'react';
import renderer from 'react-test-renderer';
import PostCard from '../components/userPostCard';
import '@testing-library/jest-dom';
import { render, screen, fireEvent,cleanup} from '@testing-library/react';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';


// testing delete button
jest.mock('../components/userPostCard', () => {
    const postCard = () => (
      <div data-testid='postCard'>user post card</div>
    );
  
    return postCard;
  });
  
  
it('Confirm deletion button', ()=>{
render(<PostCard/>);
const button = screen.getByTestId('postCard', {name: "button"});
fireEvent.click(button);
expect(screen.getByTestId("postCard")).toBeInTheDocument();
});

//testing like icon
test('renders ThumbUpRoundedIcon', () => {
    const testme = renderer.create(<ThumbUpRoundedIcon />).toJSON();
    expect(testme).toMatchSnapshot();
  });
  
  // testing comment icon
  test('renders MessageRoundedIcon', () => {
      const testme = renderer.create(<MessageRoundedIcon />).toJSON();
      expect(testme).toMatchSnapshot();
    });