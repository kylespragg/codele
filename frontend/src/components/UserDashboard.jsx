import React from 'react';
import CodeConsole from './CodeConsole';
import '../styles/UserDashboard.css';

const UserDashboard = ({ user }) => {
  return (
    <div className="user-dashboard">
      <div className="user-stats">
        <h2>Your Progress</h2>
        {/* Add user statistics here */}
      </div>
      
      <div className="daily-challenge">
        <h2>Daily Challenge</h2>
        <CodeConsole />
      </div>
    </div>
  );
};

export default UserDashboard;