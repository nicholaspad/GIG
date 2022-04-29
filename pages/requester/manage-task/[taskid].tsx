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
  getTaskUsers,
  updateApprovalStatus,
  getTaskApprovedResponsesByTasker,
  getTaskQuestions,
} from "../../../src/Database";
import { gigTheme } from "../../../src/Theme";
import { ApprovalStatus, ApprovalData } from "../../../src/Types";
import ApprovalsTable from "../../../components/tables/ApprovalTable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export default function ManageResponses() {
  const { query, isReady } = useRouter();
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [data, setData] = useState<ApprovalData[]>();
  const [refreshTable, setRefreshTable] = useState(false);

  const handleDownloadExcel = async (taskId: string) => {
    const headRow = ["Tasker Address", "Submission Time"];
    let options: { [questionId: string]: string[] } = {};

    getTaskApprovedResponsesByTasker(Moralis, taskId).then(async (res) => {
      let file = new ExcelJS.Workbook();
      let worksheet = file.addWorksheet("Survey Results");
      const questions = await getTaskQuestions(Moralis, taskId);
      for (let q of questions) {
        headRow.push(q.question);
        options[q.id] = q.content.options;
      }
      worksheet.addRow(headRow);
      res.map((r) => {
        const otherInfo = [r.taskerId, r.completedDate.toString()];
        const responses = r.responses.map((response) => {
          return options[response.questionId][response.idx];
        });
        const newRow = [...otherInfo, ...responses];
        worksheet.addRow(newRow);
      });
      file.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Results.xlsx"
        );
      });
    });
  };
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

    const res = await updateApprovalStatus(Moralis, objectId, 5, taskId);

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
      minWidth: data?.some((e) => e.status === 1) ? 400 : 165,
      flex: 1,
      align: "left",
      renderCell: (params: GridValueGetterParams) => (
        <>
          <Box mr={2}>
            <SecondaryButtonCTA
              text={"Review"}
              size="small"
              to={`/requester/manage-task/${query.taskid}/${params.row.address}`}
            />
          </Box>
          {/* Render Approval buttons for "Not Reviewed" rows */}
          {/* Use compact rendering if there are no "Not Reviewed" rows */}
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
        tempData.push({
          id: user["id"] as string,
          address: user.get("taskerId") as string,
          status: user.get("status") as ApprovalStatus,
          rating: user.get("taskerRating"),
          duration: duration,
        });
      }
      setData(tempData);
    });
  }, [isInitialized, Moralis, refreshTable, isReady]);

  return (
    <>
      <PageHeader title="Requester Manage Tasks" />
      <LoadingOverlay open={openLoading} text="Processing Approval..." />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PrimaryButtonCTA
          text="← My Tasks"
          size="small"
          to="/requester/my-tasks"
          sx={{ mr: 1, mt: 2 }}
        />
        <PrimaryButtonCTA
          text="Download Results"
          size="small"
          onClick={() => {
            handleDownloadExcel(query.taskid as string);
          }}
          sx={{ ml: 1, mt: 2 }}
        />
      </Box>
      <ApprovalsTable data={data} extraColumns={extraColumns} />
    </>
  );
}

const approvalStatusMap = {
  1: "Not Reviewed",
  2: "Approved",
  3: "Abandoned",
  4: "Paid",
  5: "Rejected",
};

const approvalStatusColorMap = {
  1: gigTheme.palette.warning.main,
  2: gigTheme.palette.success.main,
  3: gigTheme.palette.error.main,
  4: gigTheme.palette.success.main,
  5: gigTheme.palette.error.main,
};
