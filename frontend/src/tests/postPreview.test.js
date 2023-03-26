import React from 'react';
import renderer from 'react-test-renderer';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PostPreview from '../components/postPreview';
import '@testing-library/jest-dom';

//testing Thumbup icon
test('renders thumbUpIcon', () => {
  const testme = renderer.create(<ThumbUpIcon />).toJSON();
  expect(testme).toMatchSnapshot();
});

// testing comment Icon
test('renders CommentIcon', () => {
    const testme = renderer.create(<CommentIcon />).toJSON();
    expect(testme).toMatchSnapshot();
  });