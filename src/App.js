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
import ViewEventDetails from './components/ViewEventDetails';
import CreateEventReviewPage from './components/CreateEventReviewPage';
import SignUp from './components/SignUp';
import Login from './components/Login';

const AuthenticatedRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
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

const AdminRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route render={() => (authContext.isAuthenticated() && authContext.isAdmin() ? (
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

    <AuthenticatedRoute path="/admin/groups/flag/:_id">
      <FlagGroup />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/admin/groups/:_id">
      <ViewGroup />
    </AuthenticatedRoute>

    <AuthenticatedRoute path="/admin/users/flag/:_id">
      <FlagUser />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/admin/users/:_id">
      <ViewUser />
    </AuthenticatedRoute>

    <AuthenticatedRoute path="/admin/events/flag/:_id">
      <FlagEvent />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/admin/events/:_id">
      <ViewEvent />
    </AuthenticatedRoute>

    <AuthenticatedRoute path="/groups/:_id">
      <ViewGroupDetails />
    </AuthenticatedRoute>

    <AuthenticatedRoute path="/events/:_id">
      <ViewEventDetails />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/users/:_id">
      <ViewProfile />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/events/review/:_id">
      <CreateEventReviewPage />
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
