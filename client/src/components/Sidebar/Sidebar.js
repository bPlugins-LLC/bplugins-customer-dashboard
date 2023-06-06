import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "../../axios";
import { setPlugins } from "../../rtk/features/plugin/pluginSlice";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const plugin = useSelector((state) => state.plugin);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log({ user });
    if (!user.loading) {
      axios.get(`/api/v1/plugins/user/${user.user._id}`).then(({ data }) => {
        console.log(data, user);
        dispatch(setPlugins(data.data));
      });
    }
  }, [user, dispatch]);

  return (
    <Box className="bg-slate-300" sx={{ width: "240px", height: "calc(100vh - 64px)" }}>
      <List>
        {plugin?.plugins?.freemius?.map((plugin) => {
          return (
            <ListItem key={plugin._id} disablePadding>
              <Link to={`/plugin/freemius/${plugin._id}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <AppsIcon />
                  </ListItemIcon>
                  <ListItemText primary={plugin.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}

        <Divider />

        {plugin?.plugins?.gumroad?.map((plugin) => {
          console.log({ plugin });
          return (
            <ListItem key={plugin._id} disablePadding>
              <Link to={`/plugin/gumroad/${plugin._id}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <AppsIcon />
                  </ListItemIcon>
                  <ListItemText primary={plugin.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
