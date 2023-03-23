import {render,screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import App from '../components/App';
import CreatePostPage from "../pages/createPost";
import '@testing-library/jest-dom';

// create-post page in App.jsx
jest.mock('../pages/createPost', () => {
    const CreatePostPage = () => (
      <div data-testid='testCreatePostPage'>CreatePostPage</div>
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
 });

//login page router in App.jsx
 jest.mock('../pages/loginPage', () => {
  const LoginPage = () => (
    <div data-testid='testLoginPage'>LoginPage</div>
  );

  return LoginPage;
});

test('renders LoginPage', () => {
  window.history.pushState({},"","/login");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testLoginPage")).toBeInTheDocument();
});


//Register page router in App.jsx
jest.mock('../pages/registerPage', () => {
  const RegisterPage = () => (
    <div data-testid='testRegisterPage'>RegisterPage</div>
  );

  return RegisterPage;
});

test('renders RegisterPage', () => {
  window.history.pushState({},"","/register");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testRegisterPage")).toBeInTheDocument();
});

//edit post page router in App.jsx
jest.mock('../pages/editPost', () => {
  const EditPost = () => (
    <div data-testid='testEditPost'>EditPost</div>
  );

  return EditPost;
});

test('renders EditPost', () => {
  window.history.pushState({},"","/edit-post/:id");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testEditPost")).toBeInTheDocument();
});

//edit thread page router in App.jsx
jest.mock('../pages/editThread', () => {
  const EditThread = () => (
    <div data-testid='testEditThread'>EditThread</div>
  );

  return EditThread;
});

test('renders EditThread', () => {
  window.history.pushState({},"","/edit-thread/:name");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testEditThread")).toBeInTheDocument();
});

//profile page router in App.jsx
jest.mock('../pages/profilePage', () => {
  const ProfilePage = () => (
    <div data-testid='testProfilePage'>ProfilePage</div>
  );

  return ProfilePage;
});

test('renders ProfilePage', () => {
  window.history.pushState({},"","/user-profile/:username");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testProfilePage")).toBeInTheDocument();
});

//thread page router in App.jsx
jest.mock('../pages/threadPage', () => {
  const ThreadPage = () => (
    <div data-testid='testThreadPage'>ThreadPage</div>
  );

  return ThreadPage;
});

test('renders ThreadPage', () => {
  window.history.pushState({},"","/:threadName/");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testThreadPage")).toBeInTheDocument();
});


//post view page router in App.jsx
jest.mock('../pages/postView', () => {
  const PostView = () => (
    <div data-testid='testPostView'>PostView</div>
  );

  return PostView;
});

test('renders PostView', () => {
  window.history.pushState({},"","/:threadName/post/:postID");
 render(
  <BrowserRouter>
      <App/>
  </BrowserRouter>
 );

expect(screen.getByTestId("testPostView")).toBeInTheDocument();
});