import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Input, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import copyToClipBoard from "../../utils/copyToClipBoard";
import axios from "../../axios";
import Loader from "../../components/Loader/Loader";
import { fetchFreemiusPluginInstalls, fetchFreemiusPluginVersions, setDetails } from "../../rtk/features/plugin/pluginSlice";
import SimpleLoader from "../../components/Loader/SimpleLoader";
import { fetchFreemiusUser } from "../../rtk/features/user/userSlice";
import FreemiusWEbsiteTable from "./FreemiusWebsitesTable";

const Freemius = () => {
  const { plugins, details, subLoading } = useSelector((state) => state.plugin);

  const { list } = useSelector((state) => state.pluginList);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [plugin, setPlugin] = useState({});
  const [copied, setCopied] = useState(false);
  const [fetchingFile, setFetchingFile] = useState(false);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [fieldType, setFieldType] = useState("password");
  const { platform, id } = useParams();
  const { productId, licenseKey } = plugin;
  const product = list?.find((item) => item.IDs.includes(productId));
  const { docsURL, demoURL } = product || {};
  const licenseField = useRef();

  useEffect(() => {
    if (!Object.keys(details).includes(`versions${plugin?.productId}`) && plugin?.productId) {
      dispatch(fetchFreemiusPluginVersions(plugin?.productId));
    }
    if (!Object.keys(details).includes(`installs${productId}`) && plugin?.productId) {
      dispatch(fetchFreemiusPluginInstalls({ productId: plugin?.productId, userId: user?._id }));
    }
  }, [dispatch, plugin, user?._id, details]);

  console.log(plugin);

  useEffect(() => {
    setFieldType("password");
    const plugin = plugins?.[platform]?.find((item) => item._id === id);
    console.log({ plugin });
    if (!plugin) {
      setLoading(true);
      axios
        .get(`/api/v1/plugins/${id}`)
        .then(({ data }) => {
          console.log(data);
          setPlugin(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
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
    copyToClipBoard(plugin?.licenseKey);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handlePluginDownlod = async (tagId, filename) => {
    let success = false;

    let endpoint = `http://localhost:5000/api/v1/freemius/plugins/${plugin.productId}/tags/${tagId}`;

    for (let i = 0; i < 3; i++) {
      try {
        setFetchingFile(true);
        const response = await axios.get(endpoint, { responseType: "blob" });
        const fileBlobUrl = URL.createObjectURL(response.data);
        setFetchingFile(false);
        if (fileBlobUrl) {
          success = true;
          const link = document.createElement("a");
          link.href = fileBlobUrl;
          link.download = filename;
          console.log(link);
          link.click();
        }
      } catch (error) {
        console.log("something went wrong!", error);
        setFetchingFile(false);
      }
      if (success) {
        break;
      }
    }
  };

  useEffect(() => {
    if (licenseKey && product?.tableName && !details[licenseKey]) {
      setLoading(true);
      axios
        .get(`http://localhost/freemius/wp-json/license/v1/gumroad?license_key=${licenseKey}&product=${product?.tableName}`)
        .then(({ data }) => {
          // setWebsites(data.website);
          console.log(data);
          dispatch(setDetails({ [licenseKey]: data.website ? data.website : [] }));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [product, licenseKey, dispatch, details]);

  if (loading || subLoading) {
    return (
      <Box>
        <Loader className={`mt-5`} />
      </Box>
    );
  }

  if (!licenseKey || !product) {
    <h3 className="text-3xl">Something went wrong!</h3>;
  }

  const expired = plugin.freemius?.expiration && new Date(plugin.freemius?.expiration).getTime() < Date.now();

  return (
    <div>
      <Box className="flex items-center justify-center mb-5 gap-5">
        {expired && (
          <Box fullWidth>
            <h3>License Key expired!</h3>
          </Box>
        )}
        {!expired && Array.isArray(details[`versions${plugin.productId}`]) && details[`versions${plugin.productId}`]?.length ? (
          <>
            {fetchingFile && <SimpleLoader width="20" />}
            <Button disabled={fetchingFile} aria-haspopup="true" variant="contained" onClick={handleProfileMenuOpen}>
              Download <KeyboardArrowDownIcon />
            </Button>
            {docsURL && (
              <a href={docsURL} target="_blank" rel="noreferrer">
                <Button aria-haspopup="true" variant="contained">
                  Docs
                </Button>
              </a>
            )}

            {demoURL && (
              <a href={demoURL} target="_blank" rel="noreferrer">
                <Button aria-haspopup="true" variant="contained">
                  Demo
                </Button>
              </a>
            )}

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
              {details[`versions${plugin.productId}`]?.map((tag) => (
                <MenuItem classes={{ root: fetchingFile ? "opacity-50 pointer-events-none" : "" }} key={tag.version} onClick={() => handlePluginDownlod(tag.id, `${tag.premium_slug}.${tag.version}.zip`)}>
                  {`${tag.premium_slug}.${tag.version}.zip`}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <h3>Not Downloadable</h3>
        )}
      </Box>
      <Box className="flex p-3 justify-center mb-5 gap-3 items-center">
        <Typography variant="h6" className="text-3xl">
          License:
        </Typography>
        <Input style={{ width: "320px" }} ref={licenseField} type={fieldType} value={`${licenseKey}`} disabled className="mr-2" />
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
      </Box>
      <Box>
        <FreemiusWEbsiteTable licenseId={plugin?.freemius?.licenseId} productId={productId} expired={expired} />
      </Box>
    </div>
  );
};

export default Freemius;
