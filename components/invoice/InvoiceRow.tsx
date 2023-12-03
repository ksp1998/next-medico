import { Chip, IconButton, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import Moment from "react-moment";
import { InvoiceProps, OptionProps } from "@/utils/props";
import { defaultPaymentTypeOptions } from "@/utils/defaults";
import { Edit, Print } from "@mui/icons-material";

interface Props {
  invoice: InvoiceProps;
  deleteCallback?: (id: string) => void;
}

const InvoiceRow = ({ invoice }: Props) => {
  const printInvoice = () => {
    alert("In progress");
  };

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell>
        <span style={{ color: "#ff5252", fontWeight: "bold" }}>
          {invoice?.invoiceNumber}
        </span>
      </TableCell>
      <TableCell scope="row">{invoice?.customer?.name}</TableCell>
      <TableCell>
        <Chip
          label={
            defaultPaymentTypeOptions.filter(
              (option: OptionProps) => option.id === invoice?.paymentType
            )[0]?.label
          }
          color={invoice?.paymentType === "cash" ? "success" : "info"}
        />
      </TableCell>
      <TableCell>{invoice?.subtotal?.toFixed(2)}</TableCell>
      <TableCell>{invoice?.discount?.toFixed(2)}</TableCell>
      <TableCell>{invoice?.total?.toFixed(2)}</TableCell>
      <TableCell>
        <Moment date={invoice?.date} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell align="center">
        <Link
          href={`/invoices/${invoice?._id}`}
          style={{ color: "#ff5252", display: "none" }}
        >
          <IconButton>
            <Edit sx={{ color: "#02b6ff" }} />
          </IconButton>
        </Link>

        <IconButton
          sx={{ "&:disabled": { opacity: 0.5 } }}
          onClick={printInvoice}
        >
          <Print sx={{ color: "#ff5252" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceRow;
