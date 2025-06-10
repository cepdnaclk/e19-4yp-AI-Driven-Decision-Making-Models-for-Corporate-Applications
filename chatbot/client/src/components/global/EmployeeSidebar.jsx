import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SolarPowerOutlinedIcon from '@mui/icons-material/SolarPowerOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewChatIcon from '@mui/icons-material/OpenInNew';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import FAQIcon from '@mui/icons-material/HelpOutline';
import FeecbackIcon from '@mui/icons-material/EditNote';
import AddToQueueOutlinedIcon from '@mui/icons-material/AddToQueueOutlined';

// Menu Item component
const Item = ({ title, to, icon, selected, setSelected }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<MenuItem
			active={selected === title}
			style={{
				color: colors.grey[100],
			}}
			onClick={() => setSelected(title)}
			icon={icon}
		>
			<Typography>{title}</Typography>
			<Link to={to} />
		</MenuItem>
	);
};

const EmployeeSidebar = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selected, setSelected] = useState('Dashboard');

	return (
		<Box
			sx={{
				'& .pro-sidebar-inner': {
					background: `${colors.primary[400]} !important`,
				},
				'& .pro-icon-wrapper': {
					backgroundColor: 'transparent !important',
				},
				'& .pro-inner-item': {
					padding: '5px 35px 5px 20px !important',
				},
				'& .pro-inner-item:hover': {
					color: '#F7CA73 !important',
				},
				'& .pro-menu-item.active': {
					color: '#FFAC09 !important',
				},
			}}
		>
			<ProSidebar collapsed={isCollapsed}>
				<Menu iconShape="square">
					{/* LOGO AND MENU ICON */}
					<MenuItem
						onClick={() => setIsCollapsed(!isCollapsed)}
						icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
						style={{
							margin: '0 0 20px 0',
							color: colors.grey[100],
						}}
					>
						{!isCollapsed && (
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								ml="15px"
							>
								<img
									alt="logo-text"
									width="120px"
									height="auto"
									src={`../../assets/2.png`}
								/>
								<IconButton
									onClick={() => setIsCollapsed(!isCollapsed)}
								>
									<MenuOutlinedIcon />
								</IconButton>
							</Box>
						)}
					</MenuItem>

					{!isCollapsed && (
						<Box mb="25px">
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
							>
								<img
									alt="logo"
									width="100px"
									height="100px"
									src={`../../assets/3.png`}
									style={{
										borderRadius: '50%',
									}}
								/>
							</Box>
						</Box>
					)}

					{/* Menu Items */}
					<Box paddingLeft={isCollapsed ? undefined : '10%'}>
						<MenuItem
							active={selected === 'NewChat'}
							style={{
								color: colors.grey[100],
							}}
							onClick={() => setSelected('NewChat')}
							icon={<NewChatIcon />}
						>
							<Typography>New Chat</Typography>
							<Link to="/" />
						</MenuItem>
                        <Item
							title={'Feedback'}
							to="/employee-feedback"
							icon={<FeecbackIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
					</Box>
				</Menu>
			</ProSidebar>
		</Box>
	);
};

export default EmployeeSidebar;
