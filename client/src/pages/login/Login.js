import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Avatar, Button, Card, CardActions, CircularProgress, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { Login, setUser, setUserError } from "../../rtk/features/user/userSlice";

const TestLogin = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const [credential, setCredential] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!credential.email || !credential.password) {
      dispatch(setUserError("Field empty!"));
    } else {
      dispatch(Login(credential));
    }
  };

  const handleFormInput = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "url(https://source.unsplash.com/featured/1600x900)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Card sx={{ minWidth: 300, marginTop: "6em" }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: "1em",
              display: "flex",
              justifyContent: "center",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            Login
          </Box>
          <Box sx={{ padding: "0 1em 1em 1em" }}>
            <Box sx={{ marginTop: "1em" }}>
              <TextField onChange={handleFormInput} margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <TextField className={`text-red-600`} onChange={handleFormInput} margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            </Box>
          </Box>
          <CardActions sx={{ padding: "0 1em 1em 1em" }}>
            <Button variant="contained" type="submit" color="primary" disabled={loading} fullWidth>
              {loading && <CircularProgress size={25} thickness={2} />}
              Login
            </Button>
          </CardActions>
          <Box className="text-center p-3">
            <Typography className="text-red-600">{error}</Typography>
          </Box>
        </Card>
      </Box>
    </form>
  );
};

export default TestLogin;
