import { IconButton, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import Moment from "react-moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomerProps } from "@/utils/props";
import { useState } from "react";

interface Props {
  customer: CustomerProps;
  deleteCallback: (id: string) => void;
}

const CustomerRow = ({ customer, deleteCallback }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const deleteCustomer = () => {
    if (!confirm("Are you sure!")) {
      return;
    }
    setIsDisabled(true);
    deleteCallback(customer._id);
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
          href={`/customers/${customer?._id}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          {customer?.name}
        </Link>
      </TableCell>
      <TableCell scope="row">{customer?.number}</TableCell>
      <TableCell>{customer?.address}</TableCell>
      <TableCell>{customer?.doctorName}</TableCell>
      <TableCell>{customer?.doctorAddress}</TableCell>
      <TableCell>
        <Moment date={customer?.createdAt} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell align="center">
        <Link href={`/customers/${customer?._id}`}>
          <IconButton>
            <EditIcon sx={{ color: "#02b6ff" }} />
          </IconButton>
        </Link>

        <IconButton
          disabled={isDisabled}
          sx={{ "&:disabled": { opacity: 0.5 } }}
          onClick={deleteCustomer}
        >
          <DeleteIcon sx={{ color: "#ff5252" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CustomerRow;
