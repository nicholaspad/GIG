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
  getTaskerMyTasksTableData,
  taskerAbandonTask,
} from "../../src/Database";
import { gigTheme } from "../../src/Theme";
import { TaskData, TaskStatus } from "../../src/Types";

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

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [data, setData] = useState<TaskData[]>();
  const [refreshTable, setRefreshTable] = useState(false);

  const handleAbandonTask = async (taskId: string, taskName: string) => {
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to abandon task "${taskName}"?`)
    )
      return;

    setOpenLoading(true);

    const res = await taskerAbandonTask(Moralis, taskId as string);

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
          {/* Render Abandon buttons for "In Progress" rows only */}
          {/* TODO: Render according to correct statuses 
          - withdraw should be during status 2) */}
          <Box
            // display="flex"
            width={130}
            m={2}
          >
            {(params.row.status as TaskStatus) == 0 ? (
              <SecondaryButtonCTA
                text="Abandon"
                size="small"
                onClick={() => {
                  handleAbandonTask(params.row.task_id, params.row.name);
                }}
              />
            ) : (
              <SecondaryButtonCTA
                text="Withdraw"
                size="small"
                // to="/transfer-crypto"
                to={`/tasker/task-withdraw/${String(
                  params.row.task_id
                )}?back=/tasker/my-tasks`}
              />
            )}
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

  useEffect(() => {
    if (!isInitialized) return;

    getTaskerMyTasksTableData(Moralis).then((res) => {
      let tempData: TaskData[] = [];
      for (let task_ of res) {
        let task = task_ as any;
        if (task["tasks"].length < 1) continue;
        tempData.push({
          task_id: task["taskId"],
          name: task["tasks"][0]["title"],
          reward: Moralis.Units.FromWei(task["tasks"][0]["unitRewardWei"]),
          status: task["status"] as TaskStatus,
        });
      }
      setData(tempData);
    });
  }, [isInitialized, Moralis, refreshTable]);

  return (
    <>
      <PageHeader title="My Tasks" />
      <LoadingOverlay open={openLoading} text="Abandoning Task..." />
      <PrimaryButtonCTA
        text="Browse Tasks →"
        size="small"
        to="/browse-tasks"
        sx={{ mx: "auto", mt: 2 }}
      />
      <MyTasksTable type={0} data={data} extraColumns={extraColumns} />
    </>
  );
}
