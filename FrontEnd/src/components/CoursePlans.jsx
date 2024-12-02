// frontend/src/components/CoursePlans.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const CoursePlans = ({ advisingId }) => {
    const [coursePlans, setCoursePlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoursePlans = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses`, {
                    // params: { advisingId }
                });
                setCoursePlans(response.data.courses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course plans:', error);
                setError('Failed to load course plans.');
                setLoading(false);
            }
        };

        if (advisingId) {
            fetchCoursePlans();
        }
    }, [advisingId]);

    if (loading) return <p>Loading.</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Course Plans</h2>
            {coursePlans.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Term</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coursePlans.map((course, index) => (
                            <tr key={index}>
                                <td>{course.course}</td>
                                <td>{course.term}</td>
                                <td>{course.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No course plans found.</p>
            )}
        </div>
    );
};

export default CoursePlans;
