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
