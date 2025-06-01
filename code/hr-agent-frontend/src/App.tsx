import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import PDFUpload from './components/PDFUpload/PDFUpload';
import ChatBox from './components/ChatBox/ChatBox';
import Layout from './components/Layout/Layout';

function App() {
  const isAuthenticated = localStorage.getItem('auth') === 'true'; // Replace with real auth logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
            <Route path="/pdf-upload" element={<PDFUpload />} />
            <Route path="/chat" element={<ChatBox />} />
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
