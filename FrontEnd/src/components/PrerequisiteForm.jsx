import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './providers/UserContext';
import './prerequisiteForm.css';

const PrerequisiteForm = () => {
  const { updatePrerequisiteStatus } = useContext(UserContext);
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // To handle success messages
  const [prereqs, setPrereqs] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/courses');

        // Check if response data is an array
        if (Array.isArray(response.data)) {
          // Initialize all courses with isPrerequisite as false
          const updatedCourses = response.data.map(course => ({
            ...course,
            isPrerequisite: false, // Unchecked by default
          }));
          setCourses(updatedCourses);

          // Initialize the prereqs state
          const initialPrereqs = {};
          response.data.forEach(course => {
            initialPrereqs[course.courseId] = false; // Default unchecked
          });
          setPrereqs(initialPrereqs);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Failed to load courses. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      }
    };

    fetchCourses();
  }, []);

  const handleCheckboxChange = (courseId) => {
    setPrereqs(prevState => {
      const updatedState = { ...prevState };
      updatedState[courseId] = !updatedState[courseId]; // Toggle the checkbox value
      return updatedState;
    });
  };

  if (courses.length === 0) {
    return <p>Loading courses...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Get the courseIds of the checked prerequisites
      const enabledCoursesIds = Object.keys(prereqs)
        .filter(courseId => prereqs[courseId])
        .map(courseId => parseInt(courseId, 10)); // Convert courseId to integer
  
      // Find the courses from the `courses` array that match the enabled courseIds
      const enabledCourses = courses.filter(course => enabledCoursesIds.includes(course.courseId));
  
      console.log(enabledCourses);  // Debugging line to check the enabled courses
  
      // Send only the enabled courses to the server
      const response = await axios.post('http://localhost:5000/admin/update-courses', { courses: enabledCourses });
  
      if (response.status === 200) {
        setSuccessMessage("Courses updated successfully!");
        alert("Prerequisites successfully Enabled!!");
      } else {
        setError("Failed to update courses. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit changes. Please try again.");
    }
  };
  
  return (
    <div className="prerequisite-container">
      <h2>Prerequisite Management</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Course Level</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Enable</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseLevel}</td>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={prereqs[course.courseId] || false}
                    onChange={() => handleCheckboxChange(course.courseId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default PrerequisiteForm;
