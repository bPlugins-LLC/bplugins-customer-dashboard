import { useEffect } from "react";
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";

import { fetchPlugins } from "../../rtk/features/plugin/pluginSlice";
import MenuItem from "./MenuItem";
import axios from "../../axios";

const CustomerSidebar = () => {
  const { plugins } = useSelector((state) => state.plugin);
  const { user, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(fetchPlugins(user?._id));
    }
  }, [user, loading, dispatch]);

  const handleSync = async () => {
    const response = await axios.get(`/api/v1/freemius/plugins/sync/${user?._id}`);
    dispatch(fetchPlugins(user?._id));
  };

  return (
    <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
      <Box className="p-2 flex justify-center">
        <Button onClick={handleSync} variant="contained">
          Sync Data
        </Button>
      </Box>
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
