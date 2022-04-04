Moralis.Cloud.define("getBrowseTasksTableData", async () => {
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = query.aggregate([
    { sort: { unitReward: -1 } },
    { project: { objectId: 1, title: 1, avgRating: 1, unitReward: 1 } },
  ]);

  return res;
});

Moralis.Cloud.define("getTaskerMyTasksTableData", async (request) => {
  const ethAddress = request.params.ethAddress;
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = query.aggregate([
    { match: { taskerId: ethAddress } },
    { project: { objectId: 0, taskId: 1, status: 1 } },
    {
      lookup: {
        from: "Tasks",
        localField: "taskId",
        foreignField: "_id",
        as: "tasks",
      },
    },
  ]);

  return res;
});
