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
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/groups" component={ViewAllGroups} />
            <Route path="/groups/:_id" component={ViewGroup} />
          </Switch>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
