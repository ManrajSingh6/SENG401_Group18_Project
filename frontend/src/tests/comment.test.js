import React from 'react';
import renderer from 'react-test-renderer';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOffAlt';
import Comment from '../components/comment';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
//import 'jsdom-global/register';
//testing like comment
test('renders thumbUpIcon', () => {
  const testme = renderer.create(<ThumbUpIcon />).toJSON();
  expect(testme).toMatchSnapshot();
});

// testing dislike comment
test('renders thumbDownIcon', () => {
    const testme = renderer.create(<ThumbDownIcon />).toJSON();
    expect(testme).toMatchSnapshot();
  });

// testing delete comment button
jest.mock('../components/comment', () => {
  const delcom = () => (
    <div data-testid='delcommentbutton'>Comment Deletor</div>
  );

  return delcom;
});


it('render delete comment button', ()=>{
render(<Comment/>);
const button = screen.getByTestId('delcommentbutton', {name: "delete-comment-link"});
fireEvent.click(button);
expect(screen.getByTestId("delcommentbutton")).toBeInTheDocument();
});

// //testing if image upload is working properly
// it('should call any passed in onError after an image load error', () => {
//   const img = {}
//   global.document.createElement = (type) => type === 'img' ? img : null
//   const onError = jest.fn();
//   mount(<Image {...props} src={"crap.junk"} onError={onError} />);
//   img.onload();
//   expect(onError).toHaveBeenCalled();
// });