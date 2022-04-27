import { Box } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import PageHeader from "../../../components/common/PageHeader";
import { TableCell, TableHeader } from "../../../components/tables/Helpers";
import {
  getTaskResponses,
  getTaskUsers,
  updateApprovalStatus,
} from "../../../src/Database";
import { gigTheme } from "../../../src/Theme";
import { ApprovalStatus, ApprovalData } from "../../../src/Types";
import ApprovalsTable from "../../../components/tables/ApprovalTable";

export default function ManageResponses() {
  const { query, isReady } = useRouter();
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [data, setData] = useState<ApprovalData[]>();
  const [refreshTable, setRefreshTable] = useState(false);

  const handleApproveResponse = async (
    objectId: string,
    taskerId: string,
    taskId: string
  ) => {
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to approve the response of ${taskerId}?`)
    )
      return;

    setOpenLoading(true);

    const res = await updateApprovalStatus(Moralis, objectId, 2, taskId);

    if (!res.success) {
      setOpenLoading(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    setRefreshTable(!refreshTable);
    setOpenLoading(false);
  };

  const handleRejectResponse = async (
    objectId: string,
    taskerId: string,
    taskId: string
  ) => {
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to reject the response of ${taskerId}?`)
    )
      return;

    setOpenLoading(true);

    const res = await updateApprovalStatus(Moralis, objectId, 3, taskId);

    if (!res.success) {
      setOpenLoading(false);
      alert("Failed to reject response!");
      return;
    }

    alert(`Successfully rejected response from user ${taskerId}!`);
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
          color={approvalStatusColorMap[params.row.status as ApprovalStatus]}
        >
          {approvalStatusMap[params.row.status as ApprovalStatus]}
        </TableCell>
      ),
    },
    {
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      minWidth: data?.some((e) => e.status === 1) ? 290 : 165,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          {/* Render Abandon buttons for "In Progress" rows */}
          {/* Use compact rendering if there are no "In Progress" rows */}
          <Box mr={2}>
            <SecondaryButtonCTA
              text={"Review"}
              size="small"
              to={`/requester/manage-task/${query.taskid}/${params.row.address}`}
            />
          </Box>
          {data?.some((e) => e.status === 1) ? (
            <>
              <Box
                visibility={
                  (params.row.status as ApprovalStatus) === 1
                    ? "visible"
                    : "hidden"
                }
                mr={2}
              >
                <SecondaryButtonCTA
                  text="Reject"
                  size="small"
                  onClick={() => {
                    handleRejectResponse(
                      params.row.id,
                      params.row.address,
                      query.taskid as string
                    );
                  }}
                />
              </Box>
              <Box
                visibility={
                  (params.row.status as ApprovalStatus) === 1
                    ? "visible"
                    : "hidden"
                }
                mr={2}
              >
                <PrimaryButtonCTA
                  text="Approve"
                  size="small"
                  onClick={() => {
                    handleApproveResponse(
                      params.row.id,
                      params.row.address,
                      query.taskid as string
                    );
                  }}
                />
              </Box>
            </>
          ) : null}
        </>
      ),
    },
  ];

  useEffect(() => {
    if (!isReady) return;
    if (!isInitialized) return;
    const taskid = query.taskid;
    getTaskUsers(Moralis, taskid as string).then((res) => {
      let tempData: ApprovalData[] = [];
      for (let user_ of res) {
        let user = user_ as any;
        let duration = user.get("completedDate") - user.get("startDate");
        duration = Math.ceil(duration / 3600);
        console.log(user);
        tempData.push({
          id: user["id"] as string,
          address: user.get("taskerId") as string,
          status: user.get("status") as ApprovalStatus,
          rating: user.get("taskerRating"),
          duration: duration,
        });
      }
      console.log(tempData);
      setData(tempData);
    });
  }, [isInitialized, Moralis, refreshTable, isReady]);

  return (
    <>
      <PageHeader title="Requester Created Tasks" />
      <LoadingOverlay open={openLoading} text="Processing Approval..." />
      <PrimaryButtonCTA
        text="← My Tasks"
        size="small"
        to="/requester/my-tasks"
        sx={{ mx: "auto", mt: 2 }}
      />
      <ApprovalsTable data={data} extraColumns={extraColumns} />
    </>
  );
}

const approvalStatusMap = {
  1: "Not reviewed",
  2: "Approved",
  3: "Rejected",
};

const approvalStatusColorMap = {
  1: gigTheme.palette.warning.main,
  2: gigTheme.palette.success.main,
  3: gigTheme.palette.error.main,
};
