import React from 'react';
import renderer from 'react-test-renderer';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOffAlt';
import Dropdown from '../components/comment';


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