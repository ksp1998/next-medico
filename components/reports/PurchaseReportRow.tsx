import Link from "next/link";
import Moment from "react-moment";
import { Chip, TableCell, TableRow } from "@mui/material";
import { OptionProps, PurchaseProps } from "@/utils/props";
import { defaultPaymentStatusesOptions } from "@/utils/defaults";

interface Props {
  rowNo: number;
  purchase: PurchaseProps;
}

const PurchaseReportRow = ({ rowNo, purchase }: Props) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell scope="row">{rowNo}</TableCell>
      <TableCell>
        <Moment date={purchase?.date} format="YYYY-MM-DD hh:mm a"></Moment>
      </TableCell>
      <TableCell>
        <Link
          href={`/purchases/${purchase?.invoiceNumber}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          {purchase?.invoiceNumber}
        </Link>
      </TableCell>
      <TableCell scope="row">{purchase?.supplier?.name}</TableCell>
      <TableCell>
        <Chip
          label={
            defaultPaymentStatusesOptions.filter(
              (option: OptionProps) => option.id === purchase?.paymentStatus
            )[0]?.label
          }
          color={purchase?.paymentStatus === "paid" ? "success" : "info"}
        />
      </TableCell>
      <TableCell>{purchase?.amount?.toFixed(2)}</TableCell>
    </TableRow>
  );
};

export default PurchaseReportRow;
