Moralis.Cloud.define("getTaskerMyTasksTableData", async () => {
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = query.aggregate([
    { sort: { unitReward: -1 } },
    { project: { objectId: 1, title: 1, avgRating: 1, unitReward: 1 } },
  ]);

  return res;
});
