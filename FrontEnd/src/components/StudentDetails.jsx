import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/student/${id}`);
                if (response.data.success) {
                    setStudentData(response.data.student);
                } else {
                    setError(response.data.message || 'Failed to fetch student details.');
                }
                setLoading(false);
            } catch (error) {
                setError('Error fetching student details.');
                setLoading(false);
            }
        };
        fetchStudentDetails();
    }, [id]);

    const handleApproval = async (status) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/admin/student/${id}/approval`, {
                status,
                comment,
            });
            if (response.data.success) {
                alert('Status updated successfully!');
                navigate('/admin/entries');
            } else {
                alert(response.data.message || 'Failed to update status.');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Approve or Reject Advising Record</h2>
            <p><strong>Name:</strong> {studentData.studentName}</p>
            <p><strong>UIN:</strong> {studentData.userId}</p>
            <p><strong>Term:</strong> {studentData.currentTerm}</p>
            <p><strong>Status:</strong> {studentData.status}</p>
            <h3>Prerequisites</h3>
            {/* <ul>
                {studentData.prereqplan.map((courseId) => (
                    <li key={courseId}>{courseId}</li>
                ))}
            </ul> */}
            {studentData.prereqplan && studentData.prereqplan.trim() !== '' ? (
                <ul>
                    {studentData.prereqplan.split(' ').map((courseId, index) => (
                        <li key={index}>{courseId}</li>
                    ))}
                </ul>
                ) : (
                    <p>No prerequisite courses available.</p>
                )}

            <h3>Courses</h3>
    
                {studentData.courseplan && studentData.courseplan.trim() !== '' ? (
                <ul>
                    {studentData.courseplan.split(' ').map((courseId, index) => (
                        <li key={index}>{courseId}</li>
                    ))}
                </ul>
                ) : (
                    <p>No prerequisite courses available.</p>
                )}
      
            <textarea
                placeholder="Enter reason for rejection (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div>
                <button onClick={() => handleApproval('approved')}>Approve</button>
                <button onClick={() => handleApproval('rejected')}>Reject</button>
            </div>
        </div>
    );
};

export default StudentDetails;
