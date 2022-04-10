import { GridColDef } from "@mui/x-data-grid";
import { TaskData } from "../../src/Types";
import TasksTableWrapper, { TableType } from "./TasksTableWrapper";

export default function MyTasksTable(props: {
  type: TableType;
  data?: TaskData[];
  extraColumns: GridColDef[];
}) {
  return (
    <TasksTableWrapper
      type={props.type}
      data={props.data}
      extraColumns={props.extraColumns}
    />
  );
}
