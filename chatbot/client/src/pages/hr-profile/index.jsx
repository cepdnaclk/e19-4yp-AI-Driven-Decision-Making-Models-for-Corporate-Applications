import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import * as Yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const HRProfile = () => {
//   const { showAlert } = useContext(AlertContext);
//   const { data, setData } = useContext(DataContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const containerStyle = {
    background: `${colors.primary[400]}`,
    padding: "20px",
    justifyContent: "flex-start",
  };

  const textFieldStyle = {
    marginBottom: "10px",
  };

  const buttonContainerStyle = {
    marginTop: "15px",
    display: "flex",
    justifyContent: "flex-end",
  };

  const buttonStyle = {
    marginLeft: "20px",
    color: "black",
    backgroundColor: "#FFAC09",
  };

  useEffect(() => {
    axios
      .get("/admin/view")
      .then((res) => {
        const user = res.data[0];
        formikDetails.setFieldValue("username", user.username || "");
        formikDetails.setFieldValue("contact_number", user.contactNumber || "");
        formikDetails.setFieldValue("email", user.email || "");
        formikDetails.setFieldValue("user_address", user.userAddress || "");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validationSchemaDetails = Yup.object({
    username: Yup.string().required("Required"),
    contact_number: Yup.string()
      .required("Required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    email: Yup.string().email("Invalid email address"),
  });

  const validationSchemaPassword = Yup.object({
    currentPassword: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    confirmNewPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const formikDetails = useFormik({
    initialValues: {
      username: "",
      contact_number: "",
      user_address: "",
      email: "",
    },
    validationSchema: validationSchemaDetails,
    onSubmit: (values) => {
      // Handle login logic here
      axios
        .put("/admin/myProfile", {
          id: data.user_id,
          ...values,
        })
        .then((response) => {
          console.log(response);
        //   showAlert("Profile Updated Successfully", "success");
        })
        .catch((error) => {
          console.log(error);
        //   showAlert("Error Updating Profile", "error");
        });
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: validationSchemaPassword,
    onSubmit: (values) => {
      // Handle login logic here
      console.log(values);
      axios
        .put("/admin/changePassword", {
          id: data.user_id,
          ...values,
        })
        .then((response) => {
          console.log(response);
        //   showAlert("Password Updated Successfully", "success");
        })
        .catch((error) => {
          console.log(error);
        //   showAlert("Error Updating Password", "error");
        });
    },
  });

  return (
    <Box m="5px 20px" width="90%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="MY Profile" subtitle="Edit your profile" />
      </Box>

      <Box style={containerStyle}>
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "#FFAC09", margin: "10px 0 15px 0" }}
        >
          Basic Information
        </Typography>

        {/* Basic Profile Information */}
        <form onSubmit={formikDetails.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="username"
                name="username"
                value={formikDetails.values.username}
                onChange={formikDetails.handleChange}
                error={
                  formikDetails.touched.username &&
                  Boolean(formikDetails.errors.username)
                }
                helperText={
                  formikDetails.touched.username &&
                  formikDetails.errors.username
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact Number"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="contact_number"
                name="contact_number"
                value={formikDetails.values.contact_number}
                onChange={formikDetails.handleChange}
                error={
                  formikDetails.touched.contact_number &&
                  Boolean(formikDetails.errors.contact_number)
                }
                helperText={
                  formikDetails.touched.contact_number &&
                  formikDetails.errors.contact_number
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="user_address"
                name="user_address"
                value={formikDetails.values.user_address}
                onChange={formikDetails.handleChange}
                error={
                  formikDetails.touched.user_address &&
                  Boolean(formikDetails.errors.user_address)
                }
                helperText={
                  formikDetails.touched.user_address &&
                  formikDetails.errors.user_address
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="email"
                name="email"
                value={formikDetails.values.email}
                onChange={formikDetails.handleChange}
                error={
                  formikDetails.touched.email &&
                  Boolean(formikDetails.errors.email)
                }
                helperText={
                  formikDetails.touched.email && formikDetails.errors.email
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div style={buttonContainerStyle}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={buttonStyle}
                >
                  Save Changes
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>

        {/* Change Password Section */}
        <form onSubmit={formikPassword.handleSubmit}>
          <Typography
            variant="h6"
            gutterBottom
            style={{ color: "#FFAC09", margin: "10px 0 15px 0" }}
          >
            Change Password
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="currentPassword"
                name="currentPassword"
                value={formikPassword.values.currentPassword}
                onChange={formikPassword.handleChange}
                error={
                  formikPassword.touched.currentPassword &&
                  Boolean(formikPassword.errors.currentPassword)
                }
                helperText={
                  formikPassword.touched.currentPassword &&
                  formikPassword.errors.currentPassword
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="newPassword"
                name="newPassword"
                value={formikPassword.values.newPassword}
                onChange={formikPassword.handleChange}
                error={
                  formikPassword.touched.newPassword &&
                  Boolean(formikPassword.errors.newPassword)
                }
                helperText={
                  formikPassword.touched.newPassword &&
                  formikPassword.errors.newPassword
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                style={textFieldStyle}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formikPassword.values.confirmNewPassword}
                onChange={formikPassword.handleChange}
                error={
                  formikPassword.touched.confirmNewPassword &&
                  Boolean(formikPassword.errors.confirmNewPassword)
                }
                helperText={
                  formikPassword.touched.confirmNewPassword &&
                  formikPassword.errors.confirmNewPassword
                }
              />
            </Grid>
            <Grid item xs={12}>
              <div style={buttonContainerStyle}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={buttonStyle}
                >
                  Change Password
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default HRProfile;
