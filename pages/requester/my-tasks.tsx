import { Box } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../components/buttons/SecondaryButtonCTA";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import PageHeader from "../../components/common/PageHeader";
import { TableCell, TableHeader } from "../../components/tables/Helpers";
import MyTasksTable from "../../components/tables/MyTasksTable";
import {
  getRequesterCreatedTasksTableData,
  requesterAbandonTask,
} from "../../src/Database";
import { gigTheme } from "../../src/Theme";
import { CreatedTaskStatus, TaskData } from "../../src/Types";

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [data, setData] = useState<TaskData[]>();
  const [refreshTable, setRefreshTable] = useState(false);

  const handleAbandonTask = async (
    taskId: string,
    taskName: string,
    remainingReward: number
  ) => {
    if (
      !isInitialized ||
      !confirm(
        `Are you sure you want to abandon task "${taskName}"? You will be refunded approximately ${remainingReward} MATIC.`
      )
    )
      return;

    setOpenLoading(true);

    const res = await requesterAbandonTask(Moralis, taskId as string);

    if (!res.success) {
      setOpenLoading(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    setRefreshTable(!refreshTable);
    setOpenLoading(false);
  };

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
      minWidth: data?.some((e) => e.status === 0) ? 290 : 165,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          {/* Render Abandon buttons for "In Progress" rows */}
          {/* Use compact rendering if there are no "In Progress" rows */}
          {data?.some((e) => e.status === 0) ? (
            <Box
              visibility={
                (params.row.status as CreatedTaskStatus) >= 1
                  ? "hidden"
                  : "visible"
              }
              mr={2}
            >
              <SecondaryButtonCTA
                text="Abandon"
                size="small"
                onClick={() => {
                  handleAbandonTask(
                    params.row.task_id,
                    params.row.name,
                    params.row.maxRewardWei -
                      params.row.numResponses * params.row.reward
                  );
                }}
              />
            </Box>
          ) : null}
          <PrimaryButtonCTA
            text={
              (params.row.status as CreatedTaskStatus) === 0
                ? "Approvals"
                : "Overview"
            }
            size="small"
            to={
              (params.row.status as CreatedTaskStatus) === 0
                ? `/requester/manage-task/${String(params.row.task_id)}`
                : `/tasker/task-overview/${String(
                    params.row.task_id
                  )}?back=/requester/my-tasks`
            }
          />
        </>
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
    {
      field: "maxRewardWei",
      sortable: false,
      disableColumnMenu: true,
      type: "number",
      minWidth: 450,
      align: "left",
      renderHeader: () => <TableHeader>MATIC Used / Max</TableHeader>,
      renderCell: (params: GridValueGetterParams) => (
        <TableCell>
          {params.row.numResponses * params.row.reward} /{" "}
          {params.row.maxRewardWei}
        </TableCell>
      ),
    },
  ];

  useEffect(() => {
    if (!isInitialized) return;

    getRequesterCreatedTasksTableData(Moralis).then((res) => {
      let tempData: TaskData[] = [];

      for (let task_ of res) {
        let task = task_ as any;
        tempData.push({
          task_id: task["objectId"],
          name: task["title"],
          reward: Moralis.Units.FromWei(task["unitRewardWei"]),
          maxRewardWei: Moralis.Units.FromWei(task["maxRewardWei"]),
          numResponses: task["numResponses"],
          maxResponses: task["maxResponses"],
          status: task["status"] as CreatedTaskStatus,
        });
      }
      setData(tempData);
    });
  }, [isInitialized, Moralis, refreshTable]);

  return (
    <>
      <PageHeader title="Requester Created Tasks" />
      <LoadingOverlay open={openLoading} text="Abandoning Task..." />
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
