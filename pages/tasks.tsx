import { Box, Rating, styled, Typography } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TasksTable, { TaskData } from "../components/TasksTable";

export default function Tasks() {
  // TODO @nicholaspad hard-coded for now
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        rating: e % 6,
        reward: e,
      };
    }
  );

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
    {
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: 200,
      flex: 1,
      align: "left",
      renderCell: () => <PrimaryButtonCTA text="Details" size="small" to="/" />,
    },
  ];

  return (
    <>
      <Box p={2}>
        <Typography color="primary.main" fontWeight={600} fontSize={40}>
          Browse Tasks
        </Typography>
        <Typography
          color="secondary.main"
          fontStyle="italic"
          fontWeight={400}
          fontSize={20}
          mt={1}
        >
          Find your next task.
        </Typography>
      </Box>
      <Box
        width={1100}
        height={800}
        display="flex"
        flexDirection="column"
        p={2}
        sx={{ backgroundColor: "background.paper" }}
      >
        <TasksTable type="Tasks" data={data} columns={columns} />
      </Box>
    </>
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
