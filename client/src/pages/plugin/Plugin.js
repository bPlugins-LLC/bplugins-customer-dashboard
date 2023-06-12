import { useEffect, useRef, useState } from "react";
import { Box, Button, Input, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../../components/Sidebar/Sidebar";
import WebsiteTable from "./WebsiteTable";
import axios from "../../axios";
import copyToClipBoard from "../../utils/copyToClipBoard";
import Loader from "../../components/Loader/Loader";
import Gumroad from "./Gumroad";
import Freemius from "./Freemius";
import { fetchPluginList } from "../../rtk/features/pluginLIst/pluginListSlice";

const Plugin = () => {
  const [plugin, setPlugin] = useState({});
  const { plugins, loading, syncing } = useSelector((state) => state.plugin);
  const { platform, id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPluginList());
  }, [dispatch]);

  useEffect(() => {
    // setFieldType("password");
    const plugin = plugins?.[platform]?.find((item) => item._id === id);

    console.log({ plugin });
    if (!plugin) {
      // setLoading(true);
      axios
        .get(`/api/v1/plugins/${id}`)
        .then(({ data }) => {
          console.log({ data });
          setPlugin(data.data);
          // setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          // setLoading(false);
        });
    } else {
      setPlugin(plugin);
    }
  }, [id, platform, plugins]);

  if (loading) {
    return (
      <>
        <Box className="flex flex-row">
          <Box style={{ with: "240px" }}>
            <Sidebar />
          </Box>
          <Box className="flex w-full mt-10 justify-center">
            <Loader />
          </Box>
        </Box>
      </>
    );
  }

  // console.log("loading", loading);
  console.log(plugins);
  // const plugin = plugins[platform].find((item) => item._id === id);
  console.log({ plugin });

  if (!plugin) {
    return <h3>Loading...</h3>;
  }

  return (
    <Box className="flex flex-row">
      <Box style={{ with: "240px" }}>
        <Sidebar />
      </Box>
      <Box className="flex-auto p-3 pt-5">
        <Box className="text-center">
          <h2 className="text-3xl">{plugin?.name}</h2>
        </Box>
        <Box className="p-5 flex flex-row justify-center items-center gap-5 mt-4 text-center">{platform === "gumroad" ? <Gumroad /> : <Freemius plugin={plugin} />}</Box>
      </Box>
    </Box>
  );
};

export default Plugin;
