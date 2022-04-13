import MoralisType from "moralis";

/*
  Edit the below functions on the Moralis Dashboard (Cloud Functions) or by
  using the CLI and editing the cloud/cloud.js file (see the bottom
  of the Cloud Functions popup on the Moralis Dashboard).
*/

export async function checkTaskerClaimedTask(
  Moralis: MoralisType,
  taskId: string
): Promise<boolean> {
  return await Moralis.Cloud.run("checkTaskerClaimedTask", { taskId: taskId });
}

/*
  Creates a new user row in table Users if it doesn't already exist.
  Uses ethAddress as the primary key. Returns the user's data as a
  MoralisType.Object.
*/
export async function makeOrGetNewUser(
  Moralis: MoralisType
): Promise<MoralisType.Object> {
  return await Moralis.Cloud.run("makeOrGetNewUser");
}

/*
  Retrieves data for the Browse Tasks table.
*/
export async function getBrowseTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getBrowseTasksTableData");
}

/*
  Retrieves data for the My Tasks (Tasker) table.
*/
export async function getTaskerMyTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskerMyTasksTableData");
}

/*
  Retrieves data for the Created Tasks (Requester) table.
*/
export async function getRequesterCreatedTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getRequesterCreatedTasksTableData");
}

/*
  Retrieves data for the Task Details and Task Overview pages.
*/
export async function getTaskOverviewData(
  Moralis: MoralisType,
  taskId: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskOverviewData", { taskId: taskId });
}

/*
  Claims a task (Tasker functionality).
*/
export async function taskerClaimTask(
  Moralis: MoralisType,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("taskerClaimTask", { taskId: taskId });
}

/*
  Abandons a task (Tasker functionality).
  @nicholaspad Do we want abandoned tasks to return to Browse Tasks?
    Or do we want them to be marked as "Abandoned" in My Tasks and not
    let the Tasker claim them again?
*/
export async function taskerAbandonTask(
  Moralis: MoralisType,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("taskerAbandonTask", { taskId: taskId });
}
