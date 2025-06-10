// global imports
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { AlertProvider } from './contexts/AlertContextProvider';
import { ColorModeContext, useMode } from './theme';

// Appbar, Sidebar imports
import HRAppbar from './components/global/HRAppBar';
import HRSidebar from './components/global/HRSidebar';
import EmployeeAppbar from './components/global/EmployeeAppBar';
import EmployeeSidebar from './components/global/EmployeeSidebar';

// Employee Pages imports
import EmployeeChatInterface from './pages/employee-chat';
import EmployeeFeedback from './pages/employee-feedback';
import EmployeeProfile from './pages/employee-profile';

// Employee Pages imports
import HRChatInterface from './pages/hr-chat';
// import HRFeedback from './pages/hr-feedback';
import HRProfile from './pages/hr-profile';

// Login, Register imports
import React from 'react';
import Login from './pages/login';
import Register from './pages/register';

function App() {
	const [theme, colorMode] = useMode();
	const user_type = 'employee'

	const renderSidebar = () => {
		if (user_type == 'hr') {
			return <HRSidebar />;
		} else if (user_type == 'employee') {
			return <EmployeeSidebar />;
		}
	};

	const renderAppbar = () => {
		if (user_type == 'hr') {
			return <HRAppbar />;
		} else if (user_type == 'employee') {
			return <EmployeeAppbar />;
		}
	};

	const renderRoutes = () => {
		if (user_type == 'hr') {
			return (
				<Routes>
					<Route path="/" element={<HRChatInterface />} />
					{/* <Route path="/hr-feedback" element={<HRFeedback />} /> */}
					<Route path="/hr-profile" element={<HRProfile />} />
				</Routes>
			);
		} else if (user_type == 'employee') {
			return (
				<Routes>
					<Route path="/" element={<EmployeeChatInterface />} />
					<Route path="/employee-feedback" element={<EmployeeFeedback />} />
					<Route path="/employee-profile" element={<EmployeeProfile />} />
				</Routes>
			);
		}
	};

	return (
		<AlertProvider>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<div className="app">
						{renderSidebar()}
						<main className="content">
							{renderAppbar()}
						{renderRoutes()}
						</main>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</AlertProvider>
	);
}

export default App;