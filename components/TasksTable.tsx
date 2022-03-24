import { Pagination, PaginationItem, styled } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

export type TaskData = {
  task_id: number;
  name: string;
  rating?: number;
  reward: number;
};

export default function TasksTable(props: {
  type: "Tasks" | "MyTasks";
  data: TaskData[];
  columns: GridColDef[];
}) {
  return (
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
      columns={props.columns}
    />
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
    fontSize: 24,
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
    fontSize: 18,
    borderBottom: 0,
  },
  "& .MuiDataGrid-footerContainer, .MuiButtonBase-root": {
    color: theme.palette.primary.main,
    fontSize: 16,
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
