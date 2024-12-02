import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(); // Use named export for UserContext

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userEmail, setuserEmail] = useState(null);
  const [prerequisites, setPrerequisites] = useState([]);

  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/courses`);
        setPrerequisites(response.data);
      } catch (error) {
        console.error("Error fetching prerequisites:", error);
      }
    };

    fetchPrerequisites();
  }, []);

  const updatePrerequisiteStatus = async (courseId, isPrerequisite) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/courses/${courseId}/prerequisite`, {
        isPrerequisite,
      });
      setPrerequisites(prev =>
        prev.map(course =>
          course.courseId === courseId ? { ...course, isPrerequisite } : course
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        userEmail,
        setuserEmail,
        prerequisites,
        updatePrerequisiteStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access UserContext values
export const useUserContext = () => useContext(UserContext);
