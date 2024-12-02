import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { UserContext } from './providers/UserContext';

import './profile.css'; // Import the CSS file

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize the navigate hook

  if (!userInfo) {
    return <p>Loading...</p>; // Loading state while userInfo is being fetched
  }

  const handleSettingsClick = () => {
    navigate('/update-profile'); // Navigate to the profile settings page
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {userInfo.username}</p>
      <p>Email: {userInfo.email}</p>
      <p>Phone: {userInfo.phone}</p>
      <p>City: {userInfo.city}</p>
      <p>Bio: {userInfo.bio}</p>
      {/* Display other user details */}

      {/* Button to profile settings */}
      <button onClick={handleSettingsClick}>Profile Settings</button>
    </div>
  );
};

export default Profile;
