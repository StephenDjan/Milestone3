import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './advisingEntry.css';
import { useUserContext } from './providers/UserContext';

const AdvisingEntry = () => {
    const [lastTerm, setLastTerm] = useState('');
    const [lastGPA, setLastGPA] = useState('');
    const [currentTerm, setCurrentTerm] = useState('');
    const [prerequisites, setPrerequisites] = useState([]);
    const [coursePlan, setCoursePlan] = useState([]);
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { userInfo } = useUserContext();

    // Fetch courses from the API
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/advising/get_courses');
                if (response.data && Array.isArray(response.data)) {
                    setCourses(response.data); // Directly set courses from the response data
                } else {
                    setErrorMessage('Failed to load courses.');
                }
            } catch (error) {
                setErrorMessage('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Helper function to filter courses by level
    const filterCoursesByLevel = (level) => {
        const minLevel = parseInt(level, 10);
        const maxLevel = minLevel + 99;
        return courses.filter(course => {
            const courseLevel = parseInt(course.courseCode.match(/\d+/)[0], 10);
            return courseLevel >= minLevel && courseLevel <= maxLevel;
        });
    };

    // Handlers for adding prerequisites and course plans
    const handleAddPrerequisite = () => {
        setPrerequisites([...prerequisites, { course: '', level: '', id: Date.now() }]);
    };

    const handleAddCoursePlan = () => {
        setCoursePlan([...coursePlan, { course: '', level: '', id: Date.now() }]);
    };

    // Handlers for removing a specific prerequisite or course plan row
    const handleRemovePrerequisite = (id) => {
        setPrerequisites(prerequisites.filter(pre => pre.id !== id));
    };

    const handleRemoveCoursePlan = (id) => {
        setCoursePlan(coursePlan.filter(course => course.id !== id));
    };


    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            const response = await axios.post('http://localhost:5000/api/advising/entry', {
                lastTerm,
                lastGPA,
                currentTerm,
                prerequisites,
                coursePlan,
                userId: userInfo.id,
                studentName: userInfo.username,
                date: today
            });
            
            if (response.data.success) {
                alert('Advising entry submitted successfully!');
                setPrerequisites([]);
                setCoursePlan([]);
            } else {
                setErrorMessage(response.data.message || 'Submission failed.');
            }
        } catch (error) {
            setErrorMessage('Error submitting advising entry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="advising-entry-container">
            <h2>Create Advising Entry</h2>

            {/* Last Term, Last GPA, and Current Term inputs */}
            <div className="form-group row">
                <div className="form-item">
                    <label>Last Term</label>
                    <input
                        type="text"
                        placeholder="Last Term"
                        value={lastTerm}
                        onChange={(e) => setLastTerm(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label>Last GPA</label>
                    <input
                        type="text"
                        placeholder="Last GPA"
                        value={lastGPA}
                        onChange={(e) => setLastGPA(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label>Current Term</label>
                    <input
                        type="text"
                        placeholder="Current Term"
                        value={currentTerm}
                        onChange={(e) => setCurrentTerm(e.target.value)}
                    />
                </div>
            </div>

            <h3>Prerequisites</h3>
            {prerequisites.map((pre, index) => (
                <div key={pre.id} className="form-group">
                    <div className="form-item">
                        <label>Level</label>
                        <select
                            value={pre.level}
                            onChange={(e) => {
                                const updatedPre = [...prerequisites];
                                updatedPre[index].level = e.target.value;
                                setPrerequisites(updatedPre);
                            }}
                        >
                            <option value="">Select Level</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                        </select>
                    </div>
                    <div className="form-item">
                        <select
                            value={pre.course}
                            onChange={(e) => {
                                const updatedPre = [...prerequisites];
                                updatedPre[index].course = e.target.value;
                                setPrerequisites(updatedPre);
                            }}
                        >
                            <option value="">Select a prerequisite</option>
                            {filterCoursesByLevel(pre.level).map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseName} ({course.courseCode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => handleRemovePrerequisite(pre.id)} className="btn remove-btn">Remove</button>
                </div>
            ))}
            <button className="btn add-btn" onClick={handleAddPrerequisite} disabled={loading}>
                {loading ? 'Loading...' : 'Add Prerequisite'}
            </button>

            <h3>Course Plan</h3>
            {coursePlan.map((course, index) => (
                <div key={course.id} className="form-group">
                    <div className="form-item">
                        <label>Level</label>
                        <select
                            value={course.level}
                            onChange={(e) => {
                                const updatedCourses = [...coursePlan];
                                updatedCourses[index].level = e.target.value;
                                setCoursePlan(updatedCourses);
                            }}
                        >
                            <option value="">Select Level</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                        </select>
                    </div>
                    <div className="form-item">
                        <select
                            value={course.course}
                            onChange={(e) => {
                                const updatedCourses = [...coursePlan];
                                updatedCourses[index].course = e.target.value;
                                setCoursePlan(updatedCourses);
                            }}
                        >
                            <option value="">Select a course</option>
                            {filterCoursesByLevel(course.level).map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseName} ({course.courseCode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => handleRemoveCoursePlan(course.id)} className="btn remove-btn">Remove</button>
                </div>
            ))}
            <button className="btn add-btn" onClick={handleAddCoursePlan} disabled={loading}>
                {loading ? 'Loading...' : 'Add Course Plan'}
            </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="btn submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
};

export default AdvisingEntry;
