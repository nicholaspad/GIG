Moralis.Cloud.define("getBrowseTasksTableData", async () => {
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = query.aggregate([
    { sort: { unitReward: -1 } },
    {
      project: {
        objectId: 1, // taskId
        title: 1,
        avgRating: 1,
        unitReward: 1,
        requesterId: 1,
      },
    },
  ]);

  return res;
});

Moralis.Cloud.define("getTaskerMyTasksTableData", async (request) => {
  const ethAddress = request.user.get("ethAddress");
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
        foreignField: "_id", // taskId
        as: "tasks",
      },
    },
  ]);

  return res;
});

Moralis.Cloud.define("getRequesterCreatedTasksTableData", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = query.aggregate([
    { match: { requesterId: ethAddress } },
    { sort: { status: 1 } },
    {
      project: {
        objectId: 1, // taskId
        title: 1,
        unitReward: 1,
        maxReward: 1,
        status: 1,
        numResponses: 1,
        maxResponses: 1,
      },
    },
  ]);

  return res;
});

Moralis.Cloud.define("getTaskerClaimedTaskIds", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = query.aggregate([
    { match: { taskerId: ethAddress } },
    { project: { objectId: 0, taskId: 1 } },
  ]);

  return res;
});

Moralis.Cloud.define("getTaskOverviewData", async (request) => {
  const taskId = request.params.taskId;
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = query.aggregate([
    { match: { _id: taskId } },
    {
      project: {
        objectId: 0,
        title: 1,
        description: 1,
        startDate: 1,
        unitReward: 1,
        estCompletionTime: 1,
        avgRating: 1,
        requesterId: 1,
      },
    },
  ]);

  return res;
});
