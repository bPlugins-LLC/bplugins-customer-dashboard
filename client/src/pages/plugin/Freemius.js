import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Input, Menu, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import copyToClipBoard from "../../utils/copyToClipBoard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import WebsiteTable from "./WebsiteTable";
import Loader from "../../components/Loader/Loader";
import { setDetails } from "../../rtk/features/plugin/pluginSlice";
import checkFileExists from "../../utils/checkFileExists";
import SimpleLoader from "../../components/Loader/SimpleLoader";

const Freemius = () => {
  const { plugins, details } = useSelector((state) => state.plugin);
  const { list } = useSelector((state) => state.pluginList);
  const [loading, setLoading] = useState(false);
  const [plugin, setPlugin] = useState({});
  const [copied, setCopied] = useState(false);
  const [fetchingFile, setFetchingFile] = useState(false);
  // const [websites, setWebsites] = useState([]);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [fieldType, setFieldType] = useState("password");
  const { platform, id } = useParams();
  const { productId, licenseKey } = plugin;
  const product = list?.find((item) => item.IDs.includes(productId));
  const { docsURL, demoURL } = product || {};
  const licenseField = useRef();

  console.log({ plugin });

  useEffect(() => {
    setFieldType("password");
    const plugin = plugins?.[platform]?.find((item) => item._id === id);
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

  const handlePluginDownlod = async (slug) => {
    let success = false;

    let endpoint = `http://localhost/freemius/wp-json/plugin/v1/download-link/${product.folderName}/${slug}/${Date.now()}`;
    if (!product.folderName) {
      endpoint = `http://localhost/freemius/wp-json/plugin/v1/generate-link/${slug}/${Date.now()}`;
    }

    for (let i = 0; i < 3; i++) {
      try {
        setFetchingFile(true);
        const { data } = await axios.get(endpoint);
        setFetchingFile(false);
        if (data?.success) {
          success = true;
          const link = document.createElement("a");
          link.href = data.file_url;
          link.download = slug;
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

  console.log(product, list);

  if (loading) {
    return (
      <Box>
        <Loader className={`mt-5`} />
      </Box>
    );
  }

  if (!licenseKey || product) {
    <h3 className="text-3xl">Something went wrong!</h3>;
  }

  return (
    <div>
      <Box className="flex items-center justify-center gap-5">
        {Array.isArray(product?.versions) && product?.versions?.length ? (
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
              {product.versions.map((version) =>
                version.enabled ? (
                  <MenuItem classes={{ root: fetchingFile ? "opacity-50 pointer-events-none" : "" }} key={version.version} onClick={() => handlePluginDownlod(version.downloadSlug)}>
                    {version.downloadSlug}
                  </MenuItem>
                ) : (
                  ""
                )
              )}
            </Menu>
          </>
        ) : (
          <h3>Not Downloadable</h3>
        )}
      </Box>
      <Box className="flex p-3 justify-center gap-3 items-center">
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
      <Box>{/* <WebsiteTable licenseKey={licenseKey} tableName={product?.tableName} /> */}</Box>
    </div>
  );
};

export default Freemius;
