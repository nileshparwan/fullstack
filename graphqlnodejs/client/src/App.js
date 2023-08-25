import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Auth from './pages/Auth';
import Events from './pages/events';
import Bookings from './pages/bookings';
import MainNavigation from './components/Navigation/MainNavigation';

function SkipLinks() {
  return (
    <nav aria-label="Skip links">
      <ul>
        <li>
          <a href="#main-content">Skip to main content</a>
        </li>
        <li>
          <a href="# ">Skip to navigation</a>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
      <div className="App">
        <Router>
          <React.Fragment>
            <MainNavigation />
            <SkipLinks />
            <main className='main-content'>
              <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/events" element={<Events />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="*" element={null} />
              </Routes>
            </main>
          </React.Fragment>
        </Router>
      </div>
  );
}

export default App;
