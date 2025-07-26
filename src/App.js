import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './Components/LandingPage';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Announcement.js';
import TimeTable from './Components/TimeTable';
import Compliants from './Components/Compliants';
import LostItem from './Components/LostItem';
import SkillExchange from './Components/SkillExchange.js';
import Placements from './Components/Placements.js';
import PollAndFeedback from './Components/pollandfeedback.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/compliants" element={<Compliants />} />
          <Route path="/lostitem" element={<LostItem />} />
          <Route path="/Skillexchange" element={<SkillExchange/>}/>
          <Route path="/placements" element={<Placements/>}/>
          <Route path="/pollandfeedback" element={<PollAndFeedback/>}/>
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
