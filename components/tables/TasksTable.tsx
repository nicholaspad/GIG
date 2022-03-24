import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Pagination,
  PaginationItem,
  Rating,
  styled,
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
import { gigTheme } from "../../src/Theme";
import PrimaryButtonCTA from "../buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../buttons/SecondaryButtonCTA";

export type TaskStatus = 0 | 1 | 2 | 3;

export type TaskData = {
  task_id: number;
  name: string;
  rating?: number;
  status?: TaskStatus;
  reward: number;
};

const statusMap = {
  0: "In progress",
  1: "Pending verification",
  2: "Verified & paid",
  3: "Abandoned",
};

const statusColorMap = {
  0: gigTheme.palette.info.main,
  1: gigTheme.palette.warning.main,
  2: gigTheme.palette.success.main,
  3: gigTheme.palette.error.main,
};

export default function TasksTable(props: {
  type: "Tasks" | "MyTasks";
  data: TaskData[];
}) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Task Name",
      sortable: false,
      disableColumnMenu: true,
      type: "string",
      minWidth: 400,
    },
    {
      field: "reward",
      headerName: "Reward",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 150,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <Typography fontSize={18}>{params.row.reward} ETH</Typography>
      ),
    },
  ];

  if (props.type === "MyTasks") {
    columns.push({
      field: "status",
      headerName: "Status",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 200,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <Typography
          fontSize={18}
          color={statusColorMap[params.row.status as TaskStatus]}
        >
          {statusMap[params.row.status as TaskStatus]}
        </Typography>
      ),
    });
    columns.push({
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          <PrimaryButtonCTA text="Details" size="small" to="/" />
          {(params.row.status as TaskStatus) < 2 ? (
            <Box ml={2}>
              <SecondaryButtonCTA text="Abandon" size="small" to="/" />
            </Box>
          ) : null}
        </>
      ),
    });
  } else if (props.type === "Tasks") {
    columns.push({
      field: "rating",
      headerName: "Rating",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 200,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <StyledRating
          readOnly
          value={params.row.rating}
          size="large"
          precision={0.5}
          icon={<StarRoundedIcon fontSize="inherit" />}
          emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
        />
      ),
    });
    columns.push({
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      align: "left",
      renderCell: () => <PrimaryButtonCTA text="Details" size="small" to="/" />,
    });
  }

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
      columns={columns}
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

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    // color: theme.palette.primaryCTA.secondary,
    color: theme.palette.primary.main,
    opacity: 0.3,
  },
}));
