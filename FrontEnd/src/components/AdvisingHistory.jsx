import { useEffect, useState } from 'react';
import { useUserContext } from './providers/UserContext';
import axios from 'axios';
import './AdvisingHistory.css';  // Assuming you will style this component

const AdvisingHistory = () => {
    const { userInfo } = useUserContext();
    const [advisingRecords, setAdvisingRecords] = useState([]);
    const [error, setError] = useState(null);

    console.log(userInfo)

    useEffect(() => {
        const fetchAdvisingHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/advising/advising-history`, {
                    params: { id: userInfo?.id }
                });

                // Assuming the response data has the expected records format
                const records = response.data.records || [];
                console.log("This is records",records)
                setAdvisingRecords(records);
            } catch (error) {
                console.error('Error fetching advising history:', error);
                setError('Failed to load advising history.');
            }
        };

        if (userInfo) {
            fetchAdvisingHistory();
        }
    }, [userInfo]);
    

    return (
        <div className="advising-history-container">
            <h2>Advising History</h2>
            {error && <p className="error-message">{error}</p>}
            {advisingRecords.length > 0 ? (
                <table className="advising-history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Term</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {advisingRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{record.lastTerm}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No advising records found.</p>
            )}
        </div>
    );
};

export default AdvisingHistory;
