import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Header from "./components/Header/Header";
import Plugin from "./pages/plugin/Plugin";
import { useEffect } from "react";
import { verifyUserToken } from "./rtk/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/ProtectedRoute/PrivateRoute";
import Loader from "./components/Loader/Loader";
import PluginList from "./pages/plugin-list/PluginList";
import LoginHeader from "./components/Header/LoginHeader";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(verifyUserToken());
  }, [dispatch]);

  if (user.loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      {user?.user ? <Header /> : <LoginHeader />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/plugin/:platform/:id"
          element={
            <PrivateRoute>
              <Plugin />
            </PrivateRoute>
          }
        />
        <Route
          path="/plugin-list"
          element={
            <PrivateRoute requiredRole={"admin"}>
              <PluginList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
