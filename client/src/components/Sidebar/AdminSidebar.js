import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";

import MenuItem from "./MenuItem";

const AdminSidebar = () => {
  return (
    <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
      <List component="nav">
        <MenuItem to="/plugin-list" text={"Plugin List"} icon={<AppsIcon />}></MenuItem>
      </List>
    </Box>
  );
};

export default AdminSidebar;
