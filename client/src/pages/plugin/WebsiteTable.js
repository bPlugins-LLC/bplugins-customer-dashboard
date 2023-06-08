import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { deactivateLicense } from "../../rtk/features/plugin/pluginSlice";
import SimpleLoader from "../../components/Loader/SimpleLoader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DangerButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#D32F2F",
  "&:hover": {
    backgroundColor: "#910404",
  },
}));

export default function WebsiteTable({ licenseKey, tableName }) {
  const { details, subLoading } = useSelector((state) => state.plugin);
  const [websiteInDanger, setWebsiteInDanger] = React.useState(null);
  const dispatch = useDispatch();

  const handleDeactivateLicense = (website) => {
    setWebsiteInDanger(website);
    dispatch(
      deactivateLicense({
        license_key: licenseKey,
        product: tableName,
        website,
        action: "deactive",
      })
    );
  };

  const websites = details?.[licenseKey];

  if (!Array.isArray(websites) || !websites.length) {
    return (
      <Box className="mt-10">
        <Divider />
        <Typography variant="h4" className="pt-5">
          No website activated yet
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>SL.</StyledTableCell>
            <StyledTableCell>Website</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(websites) &&
            websites?.map((website, index) => (
              <StyledTableRow key={website}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {website}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {subLoading && details[`${licenseKey}`]?.indexOf(websiteInDanger) === index && <SimpleLoader width={20} />}
                  <DangerButton disabled={subLoading} variant="contained" onClick={() => handleDeactivateLicense(website)}>
                    Deactivate License
                  </DangerButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
