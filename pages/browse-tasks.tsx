import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Rating, styled } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasksTable";
import { TableHeader } from "../components/tables/Helpers";
import {
  getBrowseTasksTableData,
  getTaskerClaimedTaskIds,
} from "../src/Database";
import { TaskData } from "../src/Types";

export default function Tasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>();
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (!isInitialized || !userData) return;

    getBrowseTasksTableData(Moralis).then(async (res) => {
      const res_ = await getTaskerClaimedTaskIds(
        Moralis,
        userData.get("ethAddress")
      );

      // filter out tasks the users has claimed
      const claimedTaskIds: { [key: string]: number } = {};
      res_.map((task) => {
        claimedTaskIds[(task as any)["taskId"]] = 1;
      });

      let tempData: TaskData[] = [];
      for (let task_ of res) {
        let task = task_ as any;
        // skip tasks that the user has already claimed
        if (task["objectId"] in claimedTaskIds) continue;
        // skip tasks for which the user is the requester
        if (task["requesterId"] === userData.get("ethAddress")) continue;
        tempData.push({
          task_id: task["objectId"],
          name: task["title"],
          reward: task["unitReward"],
          rating: task["avgRating"],
        });
      }
      setData(tempData);
    });
  }, [isInitialized, userData]);

  return (
    <>
      <PageHeader title="Browse Tasks" customSetUserData={setUserData} />
      <PrimaryButtonCTA
        text="My Tasks →"
        size="small"
        to="/tasker/my-tasks"
        sx={{ mx: "auto", mt: 2 }}
      />
      <BrowseTasksTable type={1} data={data} extraColumns={extraColumns} />
    </>
  );
}

const extraColumns: GridColDef[] = [
  {
    field: "rating",
    sortable: false,
    disableColumnMenu: true,
    type: "number",
    minWidth: 200,
    align: "left",
    renderHeader: () => <TableHeader>Rating</TableHeader>,
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
  },
];

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    color: theme.palette.primary.main,
    opacity: 0.3,
  },
}));
