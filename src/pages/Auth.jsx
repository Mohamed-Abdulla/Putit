import { Button, Grid, Typography, Container, Grow, Box } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
// import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";
import { useState } from "react";
import { StyledPaper, StyledAvatar, StyledSubmitButton } from "./styles";
import { useNavigate } from "react-router-dom";
import { googleAuth, login, register } from "../redux/apiCalls";
// import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {
  let [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  // const createOrGetUser = async (res) => {
  //   const decoded = jwtDecode(res.credential);
  //   console.log(decoded);
  //   try {
  //     await googleAuth(dispatch, decoded);
  //     navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignup) {
      await login(dispatch, credentials);
      navigate("/");
    } else {
      if (credentials.confirmPassword !== credentials.password) {
        // credentials.confirmPassword.setCustomValidity("Passwords don't match");
        alert("Passwords do not match");
      } else {
        const user = credentials;
        await register(dispatch, user);
        navigate("/");
      }
    }
  };

  const handleChange = (e) => setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const switchMode = () => {
    setIsSignup(!isSignup);
    setShowPassword(false);
  };

  return (
    <Grow in>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <StyledPaper elevation={3}>
          <StyledAvatar>
            <LockOutlined />
          </StyledAvatar>
          <Typography sx={{ marginBottom: 2 }} variant="h5">
            {isSignup ? "Sign up" : "Sign in"}
          </Typography>
          <form
            sx={{
              width: "100%",
              marginTop: 3,
            }}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignup && (
                <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
              )}
            </Grid>
            <StyledSubmitButton type="submit" fullWidth variant="contained" color="primary">
              {isSignup ? "Sign Up" : "Sign In"}
            </StyledSubmitButton>
            {/* <Box display="flex" justifyContent="center">
              <Button>
                <GoogleLogin onSuccess={(res) => createOrGetUser(res)} onError={() => console.log("Login Failed")} />
              </Button>
            </Box> */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button sx={{ marginTop: 1 }} onClick={switchMode}>
                  {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Container>
    </Grow>
  );
};

export default Auth;
