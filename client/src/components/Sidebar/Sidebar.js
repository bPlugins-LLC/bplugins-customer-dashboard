import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchPlugins } from "../../rtk/features/plugin/pluginSlice";
import CustomerSidebar from "./CustomerSidebar";
import AdminSidebar from "./AdminSidebar";

const Sidebar = () => {
  const { activeRole, user, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && user?._id) {
      dispatch(fetchPlugins(user?._id));
    }
  }, [user, loading, dispatch]);

  return (
    <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
      {activeRole === "customer" ? <CustomerSidebar /> : <AdminSidebar />}
    </Box>
  );
};

export default Sidebar;
