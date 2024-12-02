import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './providers/UserContext';
import './Navbar.css';

const Navbar = () => {
  const { userInfo, setUserInfo, setuserEmail } = useContext(UserContext);

  // Handle logout function
  const handleLogout = () => {
    setUserInfo(null);
    setuserEmail(null);
    localStorage.clear(); // Clear any saved user data
    alert("You have been logged out.");
  };

  return (
    <nav className="navbar">
      <h1>Course Advising Portal</h1>
      <ul>
        <li><Link to="/">Home</Link></li>

        {/* Common Links for Both Admin and Regular Users */}

        {/* Conditional Links Based on Admin Status */}
        {userInfo ? (
          <>
            {/* Links for Regular Users (admin: 0) */}
            {userInfo.admin === 0 && (
              <>
                <li><Link to="/advising">Advising</Link></li>
                <li><Link to="/advising-entry">Advising Entry</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            )}

            {/* Links for Admin Users (admin: 1) */}
            {userInfo.admin === 1 && (
              <>
                <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                <li><Link to="/admin/pending-entries">Manage Users</Link></li>
                <li><Link to="/admin/prerequisites">Prerequisites</Link></li>
              </>
            )}

            {/* Logout Link */}
            <li>
              <Link to="/" onClick={handleLogout} className="logout-link">Logout</Link>
            </li>
          </>
        ) : (
          // Links for Unauthenticated Users
          <>
            <li><Link to="/">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
