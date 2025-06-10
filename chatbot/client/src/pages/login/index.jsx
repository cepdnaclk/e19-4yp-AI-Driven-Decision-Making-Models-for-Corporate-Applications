import {
	Box,
	Button,
	Container,
	CssBaseline,
	TextField,
	Typography,
	styled,
	Link,
	useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { tokens } from '../../theme';

const StyledContainer = styled(Container)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	marginTop: theme.spacing(8),
}));

const StyledForm = styled('form')(({ theme }) => ({
	width: '100%',
	marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Required'),
			password: Yup.string().required('Required'),
		}),
		onSubmit: (values) => {
			// Simulate frontend-only submission
			console.log('Logging in with:', values);
			alert('Logged in (mock)');
			navigate('/');
		},
	});

	return (
		<StyledContainer component="main" maxWidth="xs">
			<CssBaseline />
			<div>
                <Box
					width="200px"
					display="flex"
					justifyContent="center"
					alignContent="center"
					ml="100px"
				>
					<img src="assets/logo.png" alt="logo" width="200px" />
				</Box>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<StyledForm onSubmit={formik.handleSubmit}>
					<TextField
						fullWidth
						id="username"
						name="username"
						label="Username"
						variant="outlined"
						margin="normal"
						value={formik.values.username}
						onChange={formik.handleChange}
						error={
							formik.touched.username &&
							Boolean(formik.errors.username)
						}
						helperText={
							formik.touched.username && formik.errors.username
						}
					/>
					<TextField
						fullWidth
						id="password"
						name="password"
						label="Password"
						type="password"
						variant="outlined"
						margin="normal"
						value={formik.values.password}
						onChange={formik.handleChange}
						error={
							formik.touched.password &&
							Boolean(formik.errors.password)
						}
						helperText={
							formik.touched.password && formik.errors.password
						}
					/>
					<StyledButton
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
					>
						Login
					</StyledButton>
					<Box>
						<Typography variant="body1">
							Don't have an account?
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => {
                                    navigate('/register');
                                    window.location.reload();
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    pl="1rem"
                                    color={colors.yellowAccent[500]}
                                    sx={{ textDecoration: 'underline' }}
                                >
                                    Register here
                                </Typography>
                            </Link>
						</Typography>
					</Box>
				</StyledForm>
			</div>
		</StyledContainer>
	);
};

export default Login;
