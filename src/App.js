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
import ViewProfile from './components/ViewProfile';
import './App.css';

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
            <Route path="/users/:_id" component={ViewProfile} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
