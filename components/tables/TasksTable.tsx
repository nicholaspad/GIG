import {
  Box,
  CircularProgress,
  Pagination,
  PaginationItem,
  Rating,
  styled,
  TableContainer,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  GridValueGetterParams,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { TaskData } from "../../src/Types";
import { TableCell, TableHeader } from "./Helpers";
import { TableType } from "./TasksTableWrapper";

export default function TasksTable(props: {
  type: TableType;
  data?: TaskData[];
  extraColumns: GridColDef[];
}) {
  const columns: GridColDef[] = [
    {
      field: "name",
      sortable: false,
      disableColumnMenu: true,
      type: "string",
      minWidth: 250,
      renderHeader: () => <TableHeader>Task Name</TableHeader>,
      renderCell: (params: GridValueGetterParams) => (
        <TableCell truncateLength={25}>{params.row.name}</TableCell>
      ),
    },
    {
      field: "reward",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 150,
      align: "left",
      renderHeader: () => <TableHeader>ETH Reward</TableHeader>,
      renderCell: (params: GridValueGetterParams) => (
        <TableCell truncateLength={10}>{params.row.reward as string}</TableCell>
      ),
    },
  ];
  columns.push(...props.extraColumns);

  if (!props.data)
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress color="secondary" sx={{ mt: 2, mb: 3 }} />
        <Typography
          textAlign="center"
          color="primary"
          fontWeight={400}
          fontSize={20}
        >
          Loading...
        </Typography>
      </Box>
    );

  if (props.data.length === 0)
    return (
      <Typography
        textAlign="center"
        color="primary"
        fontWeight={400}
        fontSize={20}
      >
        No Tasks to display &#128532;
      </Typography>
    );

  return (
    <TableContainer sx={{ height: 600 }}>
      <StyledTasksTable
        disableSelectionOnClick
        disableColumnSelector
        disableDensitySelector
        density="comfortable"
        pageSize={10}
        components={{
          Pagination: CustomPagination,
        }}
        getRowId={(row) => row.task_id}
        rows={props.data}
        columns={columns}
      />
    </TableContainer>
  );
}

const StyledTasksTable = styled(DataGrid)(({ theme }) => ({
  border: 0,
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeader": {
    paddingLeft: "0",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    color: theme.palette.primary.main,
    justifyContent: "left",
    paddingLeft: "10px",
  },
  "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
    {
      outline: "none",
    },
  "& .MuiDataGrid-row": {
    transition: "0.3s",
  },
  "& .MuiDataGrid-row:hover": {
    background: theme.palette.background.default,
  },
  "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell": {
    color: theme.palette.primary.main,
    borderBottom: 0,
  },
  "& .MuiDataGrid-footerContainer, .MuiButtonBase-root": {
    color: theme.palette.primary.main,
    fontSize: 16,
  },
  "& .MuiDataGrid-overlay": {
    display: "none",
  },
}));

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="secondary"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(_: React.ChangeEvent<unknown>, value: number) =>
        apiRef.current.setPage(value - 1)
      }
    />
  );
}
