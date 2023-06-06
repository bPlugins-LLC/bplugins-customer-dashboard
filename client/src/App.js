import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Header from "./components/Header/Header";
import Plugin from "./pages/plugin/Plugin";
import { useEffect } from "react";
import axios from "./axios";
import { setUser } from "./rtk/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/ProtectedRoute/PrivateRoute";
import Loader from "./components/Loader/Loader";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const checkToken = () => {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        axios
          .get(`/api/v1/auth/verify-token?access_token=${access_token}`)
          .then(({ data }) => {
            console.log({ data });
            if (data.success) {
              dispatch(setUser(data.user));
            }
          })
          .catch(({ response }) => {
            if (response.data.message === "invalid access token") {
              localStorage.removeItem("access_token");
              dispatch(setUser("workng "));
            }
          });
      } else {
        dispatch(setUser(null));
      }
    };
    checkToken();
  }, [dispatch]);

  console.log(user);

  if (user.loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/plugin/:platform/:id"
          element={
            <PrivateRoute>
              <Plugin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
