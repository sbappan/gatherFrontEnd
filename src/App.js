/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Redirect } from 'react-router';
import './App.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ViewAllGroups from './components/ViewAllGroups';
import ViewGroup from './components/ViewGroup';
import FlagGroup from './components/FlagGroup';
import ViewProfile from './components/ViewProfile';
import ViewAllUsers from './components/ViewAllUsers';
import FlagUser from './components/FlagUser';
import ViewUser from './components/ViewUser';
import ViewAllEvents from './components/ViewAllEvents';
import ViewEvent from './components/ViewEvent';
import FlagEvent from './components/FlagEvent';
import CreateGroup from './components/CreateGroup';
import ViewGroupDetails from './components/ViewGroupDetails';
import CreateEvent from './components/CreateEvent';
import ViewEventDetails from './components/ViewEventDetails';
import CreateEventReviewPage from './components/CreateEventReviewPage';
import EditProfileInfo from './components/EditProfileInfo';
import SignUp from './components/SignUp';
import Login from './components/Login';
import EditEvent from './components/EditEvent';
import FaqPage from './components/FaqPage';

const AuthenticatedRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() => (authContext.isAuthenticated() ? (
        <>
          { children }
        </>
      ) : (
        <Redirect to="/login" />
      ))}
    />
  );
};

const AdminRoute = ({ children, ...rest }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() => (authContext.isAuthenticated() && authContext.isAdmin() ? (
        <>
          { children }
        </>
      ) : (
        <Redirect to="/" />
      ))}
    />
  );
};

const AppRoutes = () => (
  <Switch>
    <Route exact path="/signup" component={SignUp} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/FAQ" component={FaqPage} />

    <AuthenticatedRoute exact path="/">
      <Home />
    </AuthenticatedRoute>
    <AdminRoute exact path="/admin/groups">
      <ViewAllGroups />
    </AdminRoute>
    <AdminRoute exact path="/admin/users">
      <ViewAllUsers />
    </AdminRoute>
    <AdminRoute exact path="/admin/events">
      <ViewAllEvents />
    </AdminRoute>

    <AuthenticatedRoute exact path="/groups/create">
      <CreateGroup />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/events/create/:_id">
      <CreateEvent />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/users/edit/">
      <EditProfileInfo />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/events/edit/:_id">
      <EditEvent />
    </AuthenticatedRoute>

    <AdminRoute path="/admin/groups/flag/:_id">
      <FlagGroup />
    </AdminRoute>
    <AdminRoute path="/admin/groups/:_id">
      <ViewGroup />
    </AdminRoute>

    <AdminRoute path="/admin/users/flag/:_id">
      <FlagUser />
    </AdminRoute>
    <AdminRoute path="/admin/users/:_id">
      <ViewUser />
    </AdminRoute>

    <AdminRoute path="/admin/events/flag/:_id">
      <FlagEvent />
    </AdminRoute>
    <AdminRoute path="/admin/events/:_id">
      <ViewEvent />
    </AdminRoute>

    <AuthenticatedRoute path="/groups/:_id">
      <ViewGroupDetails />
    </AuthenticatedRoute>

    <AuthenticatedRoute path="/events/review/:_id">
      <CreateEventReviewPage />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/events/:_id">
      <ViewEventDetails />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/users/:_id">
      <ViewProfile />
    </AuthenticatedRoute>
  </Switch>
);

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
