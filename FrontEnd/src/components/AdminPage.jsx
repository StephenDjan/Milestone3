import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from './providers/UserContext';


const AdminPage = () => {
  const { userInfo } = useContext(UserContext);
  const [userList, setUserList] = useState([]); // Store the list of users
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is not logged in or not an admin
    if (!userInfo || !userInfo.admin) {
      alert("You do not have access to this page.");
      navigate("/"); // Redirect to homepage
    } else {
      // Fetch all users' emails from the database if the user is an admin
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/admin/users");
          setUserList(response.data.users); // Assume the response contains a list of users
        } catch (error) {
          console.error("Error fetching users", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [userInfo, navigate]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, {userInfo.username}! You have admin privileges.</p>
      
      {/* Display list of users' emails */}
      <h3>All Registered Users</h3>
      <ul>
        {userList.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
