import { Box } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../components/buttons/SecondaryButtonCTA";
import PageHeader from "../../components/common/PageHeader";
import { TableCell, TableHeader } from "../../components/tables/Helpers";
import MyTasksTable from "../../components/tables/MyTasksTable";
import { getRequesterCreatedTasksTableData } from "../../src/Database";
import { gigTheme } from "../../src/Theme";
import { CreatedTaskStatus, TaskData, TaskStatus } from "../../src/Types";

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>();

  useEffect(() => {
    if (!isInitialized) return;

    getRequesterCreatedTasksTableData(Moralis).then((res) => {
      let tempData: TaskData[] = [];

      for (let task_ of res) {
        let task = task_ as any;
        tempData.push({
          task_id: task["objectId"],
          name: task["title"],
          reward: task["unitReward"],
          maxReward: task["maxReward"],
          numResponses: task["numResponses"],
          maxResponses: task["maxResponses"],
          status: task["status"] as CreatedTaskStatus,
        });
      }
      setData(tempData);
    });
  }, [isInitialized, Moralis]);

  return (
    <>
      <PageHeader title="Requester Created Tasks" />
      <PrimaryButtonCTA
        text="Create Task →"
        size="small"
        to="/requester/create-task"
        sx={{ mx: "auto", mt: 2 }}
      />
      <MyTasksTable type={2} data={data} extraColumns={extraColumns} />
    </>
  );
}

const extraColumns: GridColDef[] = [
  {
    field: "status",
    sortable: false,
    disableColumnMenu: true,
    type: "string",
    minWidth: 120,
    align: "left",
    renderHeader: () => <TableHeader>Status</TableHeader>,
    renderCell: (params: GridValueGetterParams) => (
      <TableCell
        color={createdStatusColorMap[params.row.status as CreatedTaskStatus]}
      >
        {createdStatusMap[params.row.status as CreatedTaskStatus]}
      </TableCell>
    ),
  },
  {
    field: "",
    headerName: "",
    sortable: false,
    disableColumnMenu: true,
    minWidth: 165,
    flex: 1,
    align: "left",
    renderCell: (params: GridValueGetterParams) => (
      <>
        {/* Render Abandon buttons for "In Progress" rows */}
        {/* <Box
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
        </Box> */}
        <PrimaryButtonCTA
          text={
            (params.row.status as TaskStatus) === 0 ? "Approvals" : "Overview"
          }
          size="small"
          to={
            (params.row.status as TaskStatus) === 0
              ? "/requester/my-tasks" // TODO @nicholaspad @bzzbbz replace with link to page to approve pending tasks
              : `/tasker/task-overview/${String(
                  params.row.task_id
                )}?back=/requester/my-tasks`
          }
        />
      </>
    ),
  },
  {
    field: "maxReward",
    sortable: false,
    disableColumnMenu: true,
    type: "number",
    minWidth: 180,
    align: "left",
    renderHeader: () => <TableHeader>ETH Used / Max</TableHeader>,
    renderCell: (params: GridValueGetterParams) => (
      <TableCell>
        {params.row.numResponses * params.row.reward} / {params.row.maxReward}
      </TableCell>
    ),
  },
  {
    field: "numResponses",
    sortable: false,
    disableColumnMenu: true,
    type: "number",
    minWidth: 220,
    align: "left",
    renderHeader: () => <TableHeader># Completed / Max</TableHeader>,
    renderCell: (params: GridValueGetterParams) => (
      <TableCell>
        {params.row.numResponses} / {params.row.maxResponses}
      </TableCell>
    ),
  },
];

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
