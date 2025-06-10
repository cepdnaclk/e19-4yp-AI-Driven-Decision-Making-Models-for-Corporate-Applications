import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../theme';

const Header = ({ title, subtitle }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const date = new Date();

	return (
		<Box mb="30px">
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Box>
					<Typography
						variant="h2"
						color={colors.grey[100]}
						fontWeight="bold"
						sx={{ mb: '5px' }}
					>
						{title}
					</Typography>
				</Box>
				{/* <Box justifyItems="flex-end" ml="80px">
					<Typography variant="h5" color={colors.grey[100]}>
						{date.toDateString()}
					</Typography>
				</Box> */}
			</Box>

			<Typography variant="h5" color={colors.yellowAccent[500]}>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default Header;
