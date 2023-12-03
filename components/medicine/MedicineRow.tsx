import { Chip, IconButton, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import Moment from "react-moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MedicineProps } from "@/utils/props";
import { useState } from "react";

interface Props {
  medicine: MedicineProps;
  deleteCallback: (id: string) => void;
}

const MedicineRow = ({ medicine, deleteCallback }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const deleteMedicine = () => {
    if (!confirm("Are you sure!")) {
      return;
    }
    setIsDisabled(true);
    deleteCallback(medicine._id);
  };

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        backgroundColor: isDisabled ? "#FF000022" : "initial",
      }}
    >
      <TableCell>
        <Link
          href={`/medicines/${medicine?._id}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          {medicine?.name}
        </Link>
      </TableCell>
      <TableCell scope="row">
        {medicine?.packing && (
          <Chip label={medicine?.packing} variant="outlined" />
        )}
      </TableCell>
      <TableCell>{medicine?.genericName}</TableCell>
      {/* <TableCell>{medicine?.supplier?.name}</TableCell> */}
      <TableCell>
        <Moment date={medicine?.createdAt} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell align="center">
        <Link href={`/medicines/${medicine?._id}`}>
          <IconButton>
            <EditIcon sx={{ color: "#02b6ff" }} />
          </IconButton>
        </Link>

        <IconButton
          disabled={isDisabled}
          sx={{ "&:disabled": { opacity: 0.5 } }}
          onClick={deleteMedicine}
        >
          <DeleteIcon sx={{ color: "#ff5252" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default MedicineRow;
