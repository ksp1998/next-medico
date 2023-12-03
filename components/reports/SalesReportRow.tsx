import Link from "next/link";
import Moment from "react-moment";
import { Chip, TableCell, TableRow } from "@mui/material";
import { InvoiceProps, OptionProps } from "@/utils/props";
import { defaultPaymentTypeOptions } from "@/utils/defaults";

interface Props {
  rowNo: number;
  invoice: InvoiceProps;
}

const SalesReportRow = ({ rowNo, invoice }: Props) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell scope="row">{rowNo}</TableCell>
      <TableCell>
        <Moment date={invoice?.date} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell>
        <Link
          href={`/invoices/${invoice?._id}`}
          style={{
            color: "#ff5252",
            fontWeight: "bold",
            pointerEvents: "none",
            textDecoration: "none",
          }}
        >
          {invoice?.invoiceNumber}
        </Link>
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
      <TableCell>{invoice?.total?.toFixed(2)}</TableCell>
    </TableRow>
  );
};

export default SalesReportRow;
