import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ViewAllGroups from './components/ViewAllGroups';
import ViewGroup from './components/ViewGroup';
import FlagGroup from './components/FlagGroup';
import ViewAllEvents from './components/ViewAllEvents';
import FlagEvent from './components/FlagEvent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/groups" component={ViewAllGroups} />
            <Route path="/groups/flag/:_id" component={FlagGroup} />
            <Route path="/groups/:_id" component={ViewGroup} />

            <Route exact path="/events" component={ViewAllEvents} />
            <Route path="/events/flag/:_id" component={FlagEvent} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
