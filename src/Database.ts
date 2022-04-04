import MoralisType from "moralis";
import Query from "moralis";

/*
  Creates a new user row in table Users if it doesn't already exist.
  Uses ethAddress as the primary key. Returns the user's data as a
  MoralisTye.Object.
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
  Edit this function on the Moralis Dashboard (Cloud Functions) or by
  using the CLI and editing the cloud/cloud.js file (see the bottom
  of the Cloud Functions popup on the Moralis Dashboard).
*/
export async function getBrowseTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getBrowseTasksTableData");
}

/*
  Retrieves data for the My Tasks (Tasker) table.
  Edit this function on the Moralis Dashboard (Cloud Functions) or by
  using the CLI and editing the cloud/cloud.js file (see the bottom
  of the Cloud Functions popup on the Moralis Dashboard).
*/
export async function getTaskerMyTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskerMyTasksTableData");
}
