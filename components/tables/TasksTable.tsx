import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
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
import { gigTheme } from "../../src/Theme";
import PrimaryButtonCTA from "../buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../buttons/SecondaryButtonCTA";
import { TableType } from "./TasksTableWrapper";

export type TaskStatus = 0 | 1 | 2 | 3;
export type CreatedTaskStatus = 0 | 1 | 2;
export type TaskData = {
  task_id: string;
  name: string;
  rating?: number;
  status?: TaskStatus | CreatedTaskStatus;
  reward: number;
  maxReward?: number;
  numResponses?: number;
  maxResponses?: number;
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

const createdStatusMap = {
  0: "In Progress",
  1: "Completed",
  2: "Abandoned",
};

const createdStatusColorMap = {
  0: gigTheme.palette.warning.main,
  1: gigTheme.palette.success.main,
  2: gigTheme.palette.error.main,
};

export default function TasksTable(props: {
  type: TableType;
  data: TaskData[];
}) {
  function Header(props: { children: React.ReactNode }) {
    return (
      <Typography variant="h6" fontWeight={500}>
        {props.children}
      </Typography>
    );
  }

  function Cell(props: { color?: string; children: React.ReactNode }) {
    return (
      <Typography color={props.color} variant="body1">
        {props.children}
      </Typography>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      sortable: false,
      disableColumnMenu: true,
      type: "string",
      minWidth: 300,
      renderHeader: () => <Header>Task Name</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell>{params.row.name}</Cell>
      ),
    },
    {
      field: "reward",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 150,
      align: "left",
      renderHeader: () => <Header>Reward</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell>{params.row.reward} ETH</Cell>
      ),
    },
  ];

  if (props.type === 0) {
    // My Tasks
    columns.push({
      field: "status",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 200,
      align: "left",
      renderHeader: () => <Header>Status</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell color={statusColorMap[params.row.status as TaskStatus]}>
          {statusMap[params.row.status as TaskStatus]}
        </Cell>
      ),
    });
    columns.push({
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 290,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          {/* Render Abandon buttons for "In Progress" and "Pending Verification" rows */}
          <Box
            visibility={
              (params.row.status as TaskStatus) >= 2 ? "hidden" : "visible"
            }
            mr={2}
          >
            <SecondaryButtonCTA
              text="Abandon"
              size="small"
              to="/tasker/my-tasks"
            />
          </Box>
          <PrimaryButtonCTA
            text={
              (params.row.status as TaskStatus) == 0 ? "Continue" : "Overview"
            }
            size="small"
            // TODO @nicholaspad replace second link with route to task completed page
            to={
              (params.row.status as TaskStatus) == 0
                ? `/tasker/task/${String(params.row.task_id)}`
                : `/tasker/task-overview/${String(
                    params.row.task_id
                  )}?back=/tasker/my-tasks`
            }
          />
        </>
      ),
    });
  } else if (props.type === 1) {
    // Browse Tasks
    columns.push({
      field: "rating",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 200,
      align: "left",
      renderHeader: () => <Header>Rating</Header>,
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
      minWidth: 130,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <PrimaryButtonCTA
          text="Details"
          size="small"
          to={`/tasker/task-details/${String(params.row.task_id)}`}
        />
      ),
    });
  } else if (props.type === 2) {
    // Created Tasks
    columns.push({
      field: "status",
      sortable: false,
      disableColumnMenu: true,
      type: "string",
      minWidth: 120,
      align: "left",
      renderHeader: () => <Header>Status</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell
          color={createdStatusColorMap[params.row.status as CreatedTaskStatus]}
        >
          {createdStatusMap[params.row.status as CreatedTaskStatus]}
        </Cell>
      ),
    });
    columns.push({
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 290,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          {/* Render Abandon buttons for "In Progress" rows */}
          <Box
            visibility={
              (params.row.status as TaskStatus) >= 1 ? "hidden" : "visible"
            }
            mr={2}
          >
            <SecondaryButtonCTA
              text="Abandon"
              size="small"
              to="/requester/my-tasks"
            />
          </Box>
          <PrimaryButtonCTA
            text="Overview"
            size="small"
            to={`/tasker/task-overview/${String(
              params.row.task_id
            )}?back=/requester/my-tasks`}
          />
        </>
      ),
    });
    columns.push({
      field: "maxReward",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 180,
      align: "left",
      renderHeader: () => <Header>ETH Used / Max</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell>
          {params.row.numResponses * params.row.reward} / {params.row.maxReward}
        </Cell>
      ),
    });
    columns.push({
      field: "numResponses",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 220,
      align: "left",
      renderHeader: () => <Header># Completed / Max</Header>,
      renderCell: (params: GridValueGetterParams) => (
        <Cell>
          {params.row.numResponses} / {params.row.maxResponses}
        </Cell>
      ),
    });
  }

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

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    color: theme.palette.primary.main,
    opacity: 0.3,
  },
}));
