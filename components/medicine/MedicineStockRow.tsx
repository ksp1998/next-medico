import { Chip, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import { MedicineStockProps } from "@/utils/props";

interface Props {
  medicineStock: MedicineStockProps;
}

const MedicineStockRow = ({ medicineStock }: Props) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell>
        <Link
          href={`/medicines/${medicineStock?.medicine?._id}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          {medicineStock?.medicine?.name}
        </Link>
      </TableCell>
      <TableCell scope="row">
        {medicineStock?.medicine?.packing && (
          <Chip label={medicineStock?.medicine?.packing} variant="outlined" />
        )}
      </TableCell>
      <TableCell>{medicineStock?.medicine?.genericName}</TableCell>
      <TableCell>{medicineStock?.batchId}</TableCell>
      <TableCell>{medicineStock?.expiry}</TableCell>
      <TableCell>{medicineStock?.purchase?.supplier?.name}</TableCell>
      <TableCell>{medicineStock?.stock}</TableCell>
      <TableCell>{medicineStock?.mrp}</TableCell>
      <TableCell>{medicineStock?.rate}</TableCell>
      <TableCell>
        <Link
          href={`/purchases/${medicineStock?.purchase?.invoiceNumber}`}
          style={{ color: "#ff5252", fontWeight: "bold" }}
        >
          #{medicineStock?.purchase?.invoiceNumber}
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default MedicineStockRow;
