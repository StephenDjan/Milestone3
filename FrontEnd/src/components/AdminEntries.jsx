import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './AdminEntries.css';

const AdminEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                // Correct API URL
                const response = await axios.get('http://localhost:5000/api/admin/pending-entries');
                
                // Ensure the data exists and is in the correct format

                if (response.data.success && Array.isArray(response.data.entries)) {
                    setEntries(response.data.entries);
                    console.log('Data fetched successfully:', response.data.entries);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setError('Unexpected response format from server.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching entries:', error);
                setError('Failed to load entries.');
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    // const handleRowClick = (studentId) => {
        const handleRowClick = (advisingId) => {
        // navigate(`/admin/student/${studentId}`);
        navigate(`/admin/student/${advisingId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-entries-container">
            <h2>View Student Submitted Entries</h2>
            <p>Advising Sheets for CS Students</p>
            <table className="entries-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>UIN</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? (
                        entries.map((entry) => (
                            // <tr key={entry.advisingId} onClick={() => handleRowClick(entry.userId)} style={{ cursor: 'pointer' }}>
                            <tr key={entry.advisingId} onClick={() => handleRowClick(entry.advisingId)} style={{ cursor: 'pointer' }}>
    <td>{entry.studentName}</td>
    <td>{entry.userId}</td>
    <td>{entry.status}</td>
    <td>{new Date(entry.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</td>
</tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No entries found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminEntries;
