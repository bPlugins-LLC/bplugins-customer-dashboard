import { useEffect, useRef, useState } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../../components/Sidebar/Sidebar";
import { deletePluginListItem, fetchPluginList, setCurrentId } from "../../rtk/features/pluginLIst/pluginListSlice";
import { styled } from "@mui/material/styles";
import BasicModal from "../../components/Modal/Modal";
import PluginListForm from "./PluginListForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const PluginList = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const user = useSelector((state) => state.user);
  const { list, currentId, loading } = useSelector((state) => state.pluginList);

  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (!user.loading) {
      dispatch(fetchPluginList());
    }
  }, [user, dispatch]);

  useEffect(() => {
    console.log("working fine");
    if (!loading) {
      handleClose();
    }
  }, [loading]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure?");
    confirm && dispatch(deletePluginListItem(id));
  };

  return (
    <Box className="flex flex-row">
      <Box style={{ with: "240px" }}>
        <Sidebar />
      </Box>
      <Box className="flex-auto ml-auto mr-auto p-3 pt-5 max-w-3xl">
        <Box className="flex justify-end m-5">
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
              dispatch(setCurrentId(null));
            }}
          >
            Add
          </Button>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow style={{ background: "#ddd" }}>
                  <StyledTableCell>SL.</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            dispatch(setCurrentId(item._id));
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(item._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <BasicModal width="900px" className="max-w-full" handleClose={handleClose} handleOpen={handleOpen} open={open}>
        <PluginListForm formData={list.find((item) => item._id === currentId)} />
      </BasicModal>
    </Box>
  );
};

export default PluginList;
