import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Announcement from './Components/Announcement';
import Placements from './Components/Placements';
import PollAndFeedback from './Components/PollAndFeedback';
import TimeTable from './Components/TimeTable';
import LostItem from './Components/LostItem';
import Compliants from './Components/Compliants';
import AdminDashboard from './Components/AdminDashboard';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import LandingPage from './Components/LandingPage';
import Booking from './Components/Booking';
import Feedback from './Components/Feedback';
import Mentor from './Components/Mentor';
import SkillExchange from './Components/SkillExchange';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/announcements" element={<Announcement />} />
          <Route path="/placements" element={<Placements />} />
          {/* <Route path="/polls" element={<PollAndFeedback />} /> */}
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/lostfound" element={<LostItem />} />
          <Route path="/complaints" element={<Compliants />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/skill-exchange" element={<SkillExchange />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
