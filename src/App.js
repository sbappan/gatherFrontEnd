import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewGroup from './components/ViewGroup';
import './App.css';
// import Content from './components/Content';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        {/* <Content /> */}
        <ViewGroup />
      </main>
      <Footer />
    </div>
  );
}

export default App;
