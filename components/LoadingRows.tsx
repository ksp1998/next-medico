import { Skeleton, TableCell, TableRow } from "@mui/material";
import { ColumnProps } from "@/utils/props";

interface Props {
  columns: ColumnProps[];
  count?: number;
}

const LoadingRows = ({ columns, count = 5 }: Props) => {
  return (
    <>
      {Array.from(Array(count)).map((i) => (
        <TableRow key={Math.random()}>
          {columns.map((column) => {
            const variant = column.id === "action" ? "circular" : "rounded";
            const width = column.id === "action" ? 40 : "100%";
            const height = column.id === "action" ? 40 : 20;
            return (
              <TableCell key={`${column.id}-${i}`} align={column?.align}>
                <Skeleton
                  variant={variant}
                  sx={{ width: width }}
                  height={height}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

export default LoadingRows;
