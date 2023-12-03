import { IconButton, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import Moment from "react-moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SupplierProps } from "@/utils/props";
import { useState } from "react";

interface Props {
  supplier: SupplierProps;
  deleteCallback: (id: string) => void;
}

const SupplierRow = ({ supplier, deleteCallback }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const deleteSupplier = () => {
    if (!confirm("Are you sure!")) {
      return;
    }
    setIsDisabled(true);
    deleteCallback(supplier._id);
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
          href={`/suppliers/${supplier?._id}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          {supplier?.name}
        </Link>
      </TableCell>
      <TableCell scope="row">{supplier?.number}</TableCell>
      <TableCell>{supplier?.email}</TableCell>
      <TableCell>{supplier?.address}</TableCell>
      <TableCell>
        <Moment date={supplier?.createdAt} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell align="center">
        <Link href={`/suppliers/${supplier?._id}`}>
          <IconButton>
            <EditIcon sx={{ color: "#02b6ff" }} />
          </IconButton>
        </Link>

        <IconButton
          disabled={isDisabled}
          sx={{ "&:disabled": { opacity: 0.5 } }}
          onClick={deleteSupplier}
        >
          <DeleteIcon sx={{ color: "#ff5252" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default SupplierRow;
