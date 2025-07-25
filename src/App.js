import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import TimeTable from './Components/TimeTable';
import Compliants from './Components/Compliants';
import LostItem from './Components/LostItem';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/timetable" element={<TimeTable />} />
        <Route path="/compliants" element={<Compliants />} />
        <Route path="/lostitem" element={<LostItem />} />
        
      </Routes>
    </Router>
  );
}

export default App;
