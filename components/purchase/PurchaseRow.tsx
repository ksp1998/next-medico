import { Chip, IconButton, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import Moment from "react-moment";
import EditIcon from "@mui/icons-material/Edit";
import { OptionProps, PurchaseProps } from "@/utils/props";
import { defaultPaymentStatusesOptions } from "@/utils/defaults";

interface Props {
  purchase: PurchaseProps;
  deleteCallback?: (id: string) => void;
}

const PurchaseRow = ({ purchase }: Props) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell>
        <Link
          href={`/purchases/${purchase?.invoiceNumber}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          #{purchase?.invoiceNumber}
        </Link>
      </TableCell>
      <TableCell scope="row">{purchase?.supplier?.name}</TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        {purchase?.amount?.toFixed(2)}
      </TableCell>
      <TableCell>
        <Chip
          label={
            defaultPaymentStatusesOptions.filter(
              (option: OptionProps) => option.id === purchase?.paymentStatus
            )[0].label
          }
          color={purchase?.paymentStatus === "due" ? "info" : "success"}
        />
      </TableCell>
      <TableCell>
        <Moment date={purchase?.date} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell align="center">
        <Link href={`/purchases/${purchase?.invoiceNumber}`}>
          <IconButton>
            <EditIcon sx={{ color: "#02b6ff" }} />
          </IconButton>
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default PurchaseRow;
