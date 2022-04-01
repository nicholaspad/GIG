import MoralisType from "moralis";

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
  const results = await query.equalTo("ethAddress", ethAddress).find();

  if (results.length > 0) return results[0];

  const user = new Users();
  user.set("ethAddress", ethAddress);
  user.set("displayName", defaultDisplayName);
  user.set("email", null);
  user.set("requesterRating", null);
  await user.save();

  return user;
}
