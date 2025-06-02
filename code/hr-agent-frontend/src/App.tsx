import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import PDFUpload from './components/PDFUpload/PDFUpload';
import ChatBox from './components/ChatBox/ChatBox';
import Layout from './components/Layout/Layout';
import WeeklyReport from './components/WeeklyReport/WeeklyReport';
import EmployeeFeedbackForm from './components/FeedbackForm/EmployeeFeedback';

function App() {
  // const isAuthenticated = localStorage.getItem('auth') === 'true'; // Replace with real auth logic - this doesnt work 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/pdf-upload" element={<PDFUpload />} />
          <Route path="/chat" element={<ChatBox />} />
          <Route path="/report" element={<WeeklyReport />} />
          <Route path="/feedback" element={<EmployeeFeedbackForm />} />
        </Route>
        {/* {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/pdf-upload" element={<PDFUpload />} />
            <Route path="/chat" element={<ChatBox />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )} */}
      </Routes>
    </Router>
  );
}

export default App;
