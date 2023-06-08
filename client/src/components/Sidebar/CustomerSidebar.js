import { useEffect } from "react";
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";

import { fetchPlugins } from "../../rtk/features/plugin/pluginSlice";
import MenuItem from "./MenuItem";

const CustomerSidebar = () => {
  const { plugins } = useSelector((state) => state.plugin);
  const { user, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(fetchPlugins(user?._id));
    }
  }, [user, loading, dispatch]);

  return (
    <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
      <List>
        {plugins?.freemius?.map((plugin) => {
          return <MenuItem key={plugin._id} to={`/plugin/freemius/${plugin._id}`} text={plugin.name} icon={<AppsIcon />} />;
        })}

        <Divider />

        {plugins?.gumroad?.map((plugin) => {
          return <MenuItem key={plugin._id} to={`/plugin/gumroad/${plugin._id}`} text={plugin.name} icon={<AppsIcon />} />;
        })}
      </List>
    </Box>
  );
};

export default CustomerSidebar;
