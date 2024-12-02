// frontend/src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Profile from './components/Profile';
import ProfileSettings from './components/ProfileSettings';
import ForgotPassword from './components/ForgotPassword';
import PasswordReset from './components/PasswordReset';
import VerifyOTP from './components/Verify-otp';
import AdminPage from './components/AdminPage'; 
import AdminLogin from './components/AdminLogin';
import AdminEntries from './components/AdminEntries';
import Advising from './components/AdvisingHistory'; // Import the new Advising page
import AdvisingHistory from './components/AdvisingHistory';  // Import the AdvisingHistory component
import CoursePlans from './components/CoursePlans';          // Import the CoursePlans component
import Navbar from './components/Navbar';
import AdvisingEntry from './components/AdvisingEntry';
import AdminDashboard from './components/AdminDashboard';
import PrerequisiteForm from './components/PrerequisiteForm';
import StudentDetails from './components/StudentDetails';
import { UserContextProvider } from './components/providers/UserContext';

function App() {
    return (
      <UserContextProvider>
        <BrowserRouter>
          <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/update-profile" element={<ProfileSettings />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/advising" element={<Advising />} />
                <Route path="/advising-history" element={<AdvisingHistory />} />
                <Route path="/course-plans" element={<CoursePlans />} />
                <Route path="/advising-entry" element={<AdvisingEntry />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/prerequisites" element={<PrerequisiteForm />} />
                <Route path="/admin/student/:id" element={<StudentDetails />} />
                <Route path="/admin/pending-entries" element={<AdminEntries />} />
            </Routes>
        </BrowserRouter>
      </UserContextProvider>
    );
}

export default App;
