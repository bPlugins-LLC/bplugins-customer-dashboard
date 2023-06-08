import { useEffect, useState, version } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, FormControlLabel, FormGroup, TextareaAutosize } from "@mui/material";
import { addPluginListItem, updatePluginListItem } from "../../rtk/features/pluginLIst/pluginListSlice";
import SimpleLoader from "../../components/Loader/SimpleLoader";
import { produce } from "immer";

export default function PluginListForm({ formData }) {
  const { currentId, loading } = useSelector((state) => state.pluginList);
  const [data, setData] = useState(formData || { name: "", tableName: "", permalinks: [], versions: [] });
  const { name, IDs = [], tableName, permalinks, folderName, docsURL, demoURL, icon = {}, versions = [] } = data;
  const [versionData, setVersionData] = useState({ version: "", downloadSlug: "", enabled: false });
  //   const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.name.includes(".")) {
      const steps = e.target.name.split(".");
      const tempVar = { ...data[steps[0]], [steps[1]]: e.target.value };
      setData({ ...data, [steps[0]]: tempVar });
    } else {
      setData({ ...data, [e.target.name]: ["permalinks", "IDs"].includes(e.target.name) ? e.target.value.split(",").map((item) => item.trim()) : e.target.value });
    }
  };

  const handleAdd = () => {
    console.log(data);
    dispatch(addPluginListItem(data));
  };

  const handleUpdate = () => {
    const { _id, createdAt, updatedAt, _v, ...finalData } = data;
    console.log(finalData);
    dispatch(
      updatePluginListItem({
        id: currentId,
        data: finalData,
      })
    );
  };

  const handleVersionAdd = () => {
    const { index, ...version } = versionData;
    const newData = produce(data, (draft) => {
      if (typeof index === "number") {
        draft.versions[index] = version;
      } else {
        draft.versions.push(version);
      }
      setVersionData({ version: "", downloadSlug: "", enabled: false });
    });
    setData(newData);
  };

  const handleVersionEnable = (index) => {
    const newData = produce(data, (draft) => {
      draft.versions[index].enabled = !draft.versions[index].enabled;
    });
    setData(newData);
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
    >
      <Box className="flex gap-5">
        <TextField fullWidth id="fullWidth" label="Name" name="name" value={name} onChange={handleChange} />
        <TextField fullWidth id="outlined-uncontrolled" label="Database Table Name" name="tableName" onChange={handleChange} value={tableName} />
      </Box>

      <Box className="flex gap-5 pt-5">
        <TextField fullWidth id="outlined-uncontrolled" label="Permalinks" name="permalinks" onChange={handleChange} value={permalinks?.join(",")} />
        <TextField fullWidth id="outlined-uncontrolled" label="Folder Name" name="folderName" onChange={handleChange} value={folderName} />
      </Box>

      <Box className="flex gap-5 pb-5">
        <TextField fullWidth label="Documentation URL" name="docsURL" onChange={handleChange} value={docsURL}></TextField>
        <TextField fullWidth label="Demo URL" name="demoURL" onChange={handleChange} value={demoURL}></TextField>
      </Box>

      {/* Version start  */}
      <FormGroup>
        <h3 className="text-3xl font-semibold">Versions:</h3>
        <Box>
          {Array.isArray(versions) && (
            <>
              {versions?.length ? (
                versions.map((version, index) => (
                  <>
                    <FormControlLabel key={index} control={<Checkbox defaultChecked={false} checked={version.enabled} onClick={() => handleVersionEnable(index)} />} label={version.version} />
                    <EditIcon onClick={() => setVersionData({ ...version, index })} className="mr-5 -ml-3 cursor-pointer" fontSize="small" />
                  </>
                ))
              ) : (
                <p>No Version Added yet!</p>
              )}
            </>
          )}
        </Box>
      </FormGroup>
      <Box className="flex gap-5 pb-5">
        <TextField fullWidth label="Version ex: 2.2.1" name="version" onChange={(e) => setVersionData({ ...versionData, version: e.target.value })} value={versionData.version}></TextField>
        <TextField fullWidth label="Download Slug" name="downloadSlug" value={versionData.downloadSlug} onChange={(e) => setVersionData({ ...versionData, downloadSlug: e.target.value })}></TextField>
        <Button variant="contained" onClick={handleVersionAdd}>
          {typeof versionData.index === "number" ? "Edit" : "Add"}
        </Button>
      </Box>
      {/* Version End  */}

      <label>Product/Plugin IDs (separate by comma(,))</label>
      <TextareaAutosize style={{ border: "1px solid #ddd" }} minRows={3} id="outlined-uncontrolled" value={IDs?.join(",")} onChange={handleChange} name="IDs" />
      <Box></Box>
      <Box className="flex gap-5"></Box>
      <TextField label="Icon image src" minRows={2} id="outlined-uncontrolled" value={icon?.img} onChange={handleChange} name="icon.img" />

      <label>Icon svg</label>
      <TextareaAutosize style={{ border: "1px solid #ddd" }} minRows={2} id="outlined-uncontrolled" value={icon?.svg} onChange={handleChange} name="icon.svg" />

      <Box></Box>
      <Box className="flex justify-end items-center mt-5">
        {loading && <SimpleLoader width={22} />}
        {currentId ? (
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        ) : (
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        )}
      </Box>
    </Box>
  );
}
