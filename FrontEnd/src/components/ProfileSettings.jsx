import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from './providers/UserContext';
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        city: "",
        password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            setFormData({
                username: userInfo.username || "",
                email: userInfo.email || "",
                phone: userInfo.phone || "",
                city: userInfo.city || "",
                password: "",
                confirmPassword: ""
            });
            setIsLoading(false); // Done loading after userInfo is set
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check if passwords match
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/profile", formData);
            if (response.data.success) {
                setUserInfo(response.data.user); // Update context with the new user info
                alert("Profile updated successfully");
                navigate("/profile"); // Redirect to Profile page
            } else {
                alert("Update failed");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfileSettings;
