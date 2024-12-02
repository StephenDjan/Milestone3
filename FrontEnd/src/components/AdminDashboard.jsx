import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingEntries: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/dashboard-data");
        const { totalStudents, pendingEntries, totalCourses } = response.data;

        // Check if the response data has the expected keys
        if (totalStudents !== undefined && pendingEntries !== undefined && totalCourses !== undefined) {
          setDashboardData(response.data);
        } else {
          setError("Invalid response data from the server.");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <Link to="/admin/prerequisites">
            <h3>Enable Prerequisites</h3>
          </Link>
          <p>Total Students: {dashboardData.totalStudents}</p>
        </div>
        <div className="metric-card">
          <Link to="/admin/pending-entries">
            <h3>Pending Advising Entries</h3>
          </Link>
          <p>Pending Entries: {dashboardData.pendingEntries}</p>
        </div>
        <div className="metric-card">
          <Link to="/admin/courses">
            <h3>Total Courses</h3>
          </Link>
          <p>Total Courses: {dashboardData.totalCourses}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
