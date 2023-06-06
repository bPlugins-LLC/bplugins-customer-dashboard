import { Box } from "@mui/material";
import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

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
