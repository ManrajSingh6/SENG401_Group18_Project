import {render,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import CreatePostPage from "../pages/createPost";
import '@testing-library/jest-dom';

jest.mock('../pages/createPost', () => {
    const CreatePostPage = () => (
      <div data-testid='testCreatePostPage'>Hello World</div>
    );
  
    return CreatePostPage;
  });

 test('renders CreatePostPage', () => {
    window.history.pushState({},"","/create-post");
   render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
   );

  expect(screen.getByTestId("testCreatePostPage")).toBeInTheDocument();
   //const linkElement = screen.getByText(/learn react/i);
   //expect(linkElement).toBeInTheDocument();
 });

