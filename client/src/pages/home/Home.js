import { Box } from "@mui/material";
import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { fetchFreemiusUser } from "../../rtk/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  return (
    <Box className="flex flex-row">
      <Sidebar />
      <Box className="flex-auto p-3">
        <h1 className="text-3xl font-bold underline">Dashboard</h1>
      </Box>
    </Box>
  );
};

export default Home;
