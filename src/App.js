import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';
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


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/admin/groups" component={ViewAllGroups} />
            <Route path="/admin/groups/flag/:_id" component={FlagGroup} />
            <Route path="/admin/groups/:_id" component={ViewGroup} />
            <Route exact path="/admin/users" component={ViewAllUsers} />
            <Route path="/admin/users/flag/:_id" component={FlagUser} />
            <Route path="/admin/users/:_id" component={ViewUser} />
            <Route exact path="/admin/events" component={ViewAllEvents} />
            <Route path="/admin/events/flag/:_id" component={FlagEvent} />
            <Route path="/groups/:_id" component={ViewGroupDetails} />
            <Route path="/events/:_id" component={ViewEventDetails} />
            <Route exact path="/admin/events/:_id" component={ViewEvent} />
            <Route path="/users/:_id" component={ViewProfile} />
            <Route exact path="/groups/create" component={CreateGroup} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
