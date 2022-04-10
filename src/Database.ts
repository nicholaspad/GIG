import MoralisType from "moralis";

/*
  Edit the below functions on the Moralis Dashboard (Cloud Functions) or by
  using the CLI and editing the cloud/cloud.js file (see the bottom
  of the Cloud Functions popup on the Moralis Dashboard).
*/

/*
  Creates a new user row in table Users if it doesn't already exist.
  Uses ethAddress as the primary key. Returns the user's data as a
  MoralisType.Object.
*/
export async function makeOrGetNewUser(
  Moralis: MoralisType,
  ethAddress: string
): Promise<MoralisType.Object> {
  const tableName = "Users";
  const defaultDisplayName = "GIG User";

  const Users = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Users);
  const res = await query.equalTo("ethAddress", ethAddress).find();

  if (res.length > 0) return res[0];

  const user = new Users();
  user.set("ethAddress", ethAddress);
  user.set("displayName", defaultDisplayName);
  user.set("email", null);
  user.set("requesterRating", null);
  await user.save();

  return user;
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
  Moralis: MoralisType,
  ethAddress: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskerMyTasksTableData", {
    ethAddress: ethAddress,
  });
}

/*
  Retrieves data for the Created Tasks (Requester) table.
*/
export async function getRequesterCreatedTasksTableData(
  Moralis: MoralisType,
  ethAddress: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getRequesterCreatedTasksTableData", {
    ethAddress: ethAddress,
  });
}

/*
  Retreives the task IDs for the tasks a user has claimed.
*/
export async function getTaskerClaimedTaskIds(
  Moralis: MoralisType,
  ethAddress: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskerClaimedTaskIds", {
    ethAddress: ethAddress,
  });
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
  ethAddress: string,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  if (await checkTaskerClaimedTask(Moralis, ethAddress, taskId))
    return {
      success: false,
      message: `Address ${ethAddress} has already claimed task ${taskId}.`,
    };

  const tableName = "TaskUsers";
  const TaskUsers = Moralis.Object.extend(tableName);

  const taskUser = new TaskUsers();
  taskUser.set("taskerId", ethAddress);
  taskUser.set("taskId", taskId);
  taskUser.set("startDate", new Date());
  taskUser.set("completedDate", null);
  taskUser.set("taskerRating", null);
  taskUser.set("status", 0);
  taskUser.set("hasRated", false);
  await taskUser.save();

  return {
    success: true,
    message: `Address ${ethAddress} successfully claimed task ${taskId}!`,
  };
}

/*
  Check that a task is claimed by a Tasker.
*/
export async function checkTaskerClaimedTask(
  Moralis: MoralisType,
  ethAddress: string,
  taskId: string
): Promise<boolean> {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = await query
    .equalTo("taskerId", ethAddress)
    .equalTo("taskId", taskId)
    .find();

  return res.length > 0;
}

/*
  Abandons a task (Tasker functionality).
  @nicholaspad Do we want abandoned tasks to return to Browse Tasks?
    Or do we want them to be marked as "Abandoned" in My Tasks and not
    let the Tasker claim them again?
*/
export async function taskerAbandonTask(
  Moralis: MoralisType,
  ethAddress: string,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  if (!(await checkTaskerClaimedTask(Moralis, ethAddress, taskId)))
    return {
      success: false,
      message: `Address ${ethAddress} has not claimed task ${taskId}.`,
    };

  const tableName = "TaskUsers";
  const TaskUsers = Moralis.Object.extend(tableName);

  const query = new Moralis.Query(TaskUsers);
  const res = await query
    .equalTo("taskerId", ethAddress)
    .equalTo("taskId", taskId)
    .first();

  console.log(taskId);

  if (!res)
    return {
      success: false,
      message: `Address ${ethAddress} failed to abandon task ${taskId}.`,
    };

  return res.destroy().then(
    () => {
      return {
        success: true,
        message: `Address ${ethAddress} successfully abandoned task ${taskId}!`,
      };
    },
    (error) => {
      return {
        success: false,
        message: `Address ${ethAddress} failed to abandon task ${taskId}: ${error}`,
      };
    }
  );
}
