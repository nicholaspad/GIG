import { Box } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../components/buttons/SecondaryButtonCTA";
import PageHeader from "../../components/common/PageHeader";
import { TableCell, TableHeader } from "../../components/tables/Helpers";
import MyTasksTable from "../../components/tables/MyTasksTable";
import { getTaskerMyTasksTableData } from "../../src/Database";
import { gigTheme } from "../../src/Theme";
import { TaskData, TaskStatus } from "../../src/Types";

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>([]);
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (!isInitialized || !userData) return;

    getTaskerMyTasksTableData(Moralis, userData.get("ethAddress")).then(
      (res) => {
        let tempData: TaskData[] = [];
        for (let task_ of res) {
          let task = task_ as any;
          if (task["tasks"].length < 1) continue;
          tempData.push({
            task_id: task["taskId"],
            name: task["tasks"][0]["title"],
            reward: task["tasks"][0]["unitReward"],
            status: task["status"] as TaskStatus,
          });
        }
        setData(tempData);
      }
    );
  }, [isInitialized, userData]);

  return (
    <>
      <PageHeader title="My Tasks" customSetUserData={setUserData} />
      <PrimaryButtonCTA
        text="Browse Tasks →"
        size="small"
        to="/browse-tasks"
        sx={{ mx: "auto" }}
      />
      <MyTasksTable type={0} data={data} extraColumns={extraColumns} />
    </>
  );
}

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

const extraColumns: GridColDef[] = [
  {
    field: "status",
    sortable: false,
    disableColumnMenu: true,
    type: "number",
    minWidth: 200,
    align: "left",
    renderHeader: () => <TableHeader>Status</TableHeader>,
    renderCell: (params: GridValueGetterParams) => (
      <TableCell color={statusColorMap[params.row.status as TaskStatus]}>
        {statusMap[params.row.status as TaskStatus]}
      </TableCell>
    ),
  },
  {
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
  },
];
