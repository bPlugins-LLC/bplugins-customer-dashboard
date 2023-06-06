import { useEffect, useRef, useState } from "react";
import { Box, Button, Input, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar from "../../components/Sidebar/Sidebar";
import WebsiteTable from "./WebsiteTable";
import axios from "../../axios";
import copyToClipBoard from "../../utils/copyToClipBoard";
import Loader from "../../components/Loader/Loader";

const Plugin = () => {
  const { plugins, loading } = useSelector((state) => state.plugin);
  const [plugin, setPlugin] = useState(null);
  const [copied, setCopied] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [fieldType, setFieldType] = useState("password");
  const { platform, id } = useParams();

  const licenseField = useRef();

  useEffect(() => {
    setFieldType("password");
    const plugin = plugins?.[platform]?.find((item) => item._id == id);
    if (!plugin) {
      axios
        .get(`/api/v1/plugins/${id}`)
        .then(({ data }) => {
          console.log(data);
          setPlugin(data.data);
        })
        .catch((err) => console.log(err.message));
    } else {
      setPlugin(plugin);
    }
  }, [id, platform, plugins]);

  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLicenseCopy = () => {
    setCopied(true);
    copyToClipBoard(plugin.licenseKey);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (loading) {
    return (
      <>
        <Box className="flex flex-row">
          <Box style={{ with: "240px" }}>
            <Sidebar />
          </Box>
          <Loader />
        </Box>
      </>
    );
  }

  return (
    <Box className="flex flex-row">
      <Box style={{ with: "240px" }}>
        <Sidebar />
      </Box>
      <Box className="flex-auto p-3 pt-5">
        <Box className="text-center">
          <h2 className="text-3xl">3D Viewer</h2>
        </Box>
        <Box className="p-5 flex flex-row justify-center items-center gap-5 mt-4 text-center">
          <Box>
            <Button aria-haspopup="true" variant="contained" onClick={handleProfileMenuOpen}>
              Download <KeyboardArrowDownIcon />
            </Button>
            {
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>3d viewer v1.3.5</MenuItem>
                <MenuItem onClick={handleMenuClose}>3D Viewer v1.3.5</MenuItem>
                <MenuItem onClick={handleMenuClose}>3D Viewer v1.3.5</MenuItem>
                <MenuItem onClick={handleMenuClose}>3D Viewer v1.3.5</MenuItem>
                <MenuItem onClick={handleMenuClose}>3D Viewer v1.3.5</MenuItem>
              </Menu>
            }
          </Box>
          <Box className="flex p-3 justify-center gap-3 items-center">
            <Typography variant="h6" className="text-3xl">
              License:
            </Typography>
            <Input style={{ width: "300px" }} ref={licenseField} type={fieldType} value={`${plugin?.licenseKey}`} disabled className="mr-2" />
            <Button variant="outlined" onClick={() => setFieldType(fieldType === "password" ? "text" : "password")}>
              View <VisibilityIcon className="ml-2" />
            </Button>
            <Button variant="outlined" onClick={handleLicenseCopy}>
              {copied ? (
                "Copied"
              ) : (
                <>
                  Copy <ContentCopyIcon className="ml-2" />
                </>
              )}
            </Button>
            {/* <input className="hidden" value={plugin?.licenseKey} ref={licenseField} /> */}
          </Box>
        </Box>
        <Box>
          <WebsiteTable website={[]} />
        </Box>
      </Box>
    </Box>
  );
};

export default Plugin;
