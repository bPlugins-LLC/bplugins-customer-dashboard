import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchPlugins } from "../../rtk/features/plugin/pluginSlice";
import CustomerSidebar from "./CustomerSidebar";
import AdminSidebar from "./AdminSidebar";
import { setDrawerOpen } from "../../rtk/features/user/userSlice";

const Sidebar = () => {
  const { activeRole, user, loading, drawerOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    dispatch(setDrawerOpen(open));
  };

  useEffect(() => {
    if (!loading && user?._id) {
      dispatch(fetchPlugins(user?._id));
    }
  }, [user, loading, dispatch]);

  return (
    <>
      {/* <Button onClick={toggleDrawer(true)}>{"Left"}</Button> */}
      {/* <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
        {activeRole === "customer" ? <CustomerSidebar /> : <AdminSidebar />}
      </Box> */}
      <Drawer anchor={"left"} open={drawerOpen} onClose={toggleDrawer(false)}>
        {activeRole === "customer" ? <CustomerSidebar /> : <AdminSidebar />}
      </Drawer>
    </>
  );
};

export default Sidebar;
