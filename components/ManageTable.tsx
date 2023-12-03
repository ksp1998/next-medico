import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import LoadingRows from "./LoadingRows";
import { ColumnProps } from "@/utils/props";
import { defaultRowsPerPageLengths, defaultTableStyle } from "@/utils/defaults";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  ariaTable?: string;
  count: number;
  params: Record<string, any>;
  setParams: Dispatch<SetStateAction<Record<string, any>>>;
  columns: ColumnProps[];
  length: number;
  isLoading?: boolean;
  labelRowsPerPage?: string;
  noRecordsLabel?: string;
  pagination?: boolean;
  rows: ReactNode[];
}

const ManageTable = ({
  ariaTable = "",
  count,
  params,
  setParams,
  columns,
  length,
  isLoading = false,
  labelRowsPerPage = "Records per page",
  noRecordsLabel = "No records found",
  pagination = true,
  rows,
}: Props) => {
  return (
    <>
      <TableContainer component={Paper} sx={defaultTableStyle}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label={ariaTable}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  padding="normal"
                  sortDirection={params.order}
                >
                  {column?.sortable ? (
                    <TableSortLabel
                      active={params.orderBy === column.id}
                      direction={
                        params.orderBy === column.id ? params.order : "asc"
                      }
                      onClick={() => {
                        const isAsc =
                          params.orderBy === column.id &&
                          params.order === "asc";
                        setParams((prev) => ({
                          ...prev,
                          order: isAsc ? "desc" : "asc",
                          orderBy: column.id,
                        }));
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{column.label}</span>
                    </TableSortLabel>
                  ) : (
                    <span style={{ fontWeight: "bold" }}>{column.label}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <LoadingRows columns={columns} count={params.limit} />
            )}

            {!isLoading &&
              (length > 0 ? (
                rows
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    {noRecordsLabel}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && count > 0 && (
        <TablePagination
          sx={{ "& p": { mb: 0 } }}
          labelRowsPerPage={labelRowsPerPage}
          rowsPerPageOptions={defaultRowsPerPageLengths}
          component="div"
          count={count}
          rowsPerPage={params.limit}
          page={params.page}
          onPageChange={(e, page) => setParams((prev) => ({ ...prev, page }))}
          onRowsPerPageChange={(e) =>
            setParams((prev) => ({
              ...prev,
              page: 0,
              limit: parseInt(e.target.value, 10),
            }))
          }
        />
      )}
    </>
  );
};

export default ManageTable;
