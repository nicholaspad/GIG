/*
  Check that a task is claimed by a Tasker.
*/
async function checkTaskerClaimedTask(ethAddress, taskId) {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = await query
    .equalTo("taskerId", ethAddress)
    .equalTo("taskId", taskId)
    .find();

  return res.length > 0;
}

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("checkTaskerClaimedTask", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const taskId = request.params.taskId;
  return await checkTaskerClaimedTask(ethAddress, taskId);
});

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("makeOrGetNewUser", async (request) => {
  const ethAddress = request.user.get("ethAddress");
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
});

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("getBrowseTasksTableData", async (request) => {
  /*
  Retreives the task IDs for the tasks a user has claimed.
*/
  async function getTaskerClaimedTaskIds(ethAddress) {
    const tableName = "TaskUsers";

    const TaskUsers = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(TaskUsers);
    const res = query.aggregate([
      { match: { taskerId: ethAddress } },
      { project: { objectId: 0, taskId: 1 } },
    ]);

    return res;
  }

  const ethAddress = request.user.get("ethAddress");
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);
  const res = await query.aggregate([
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

  const claimedTaskIds = {};
  (await getTaskerClaimedTaskIds(ethAddress)).forEach((task) => {
    claimedTaskIds[task["taskId"]] = 1;
  });

  return res.filter((task) => !(task["objectId"] in claimedTaskIds));
});

/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("taskerClaimTask", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const taskId = request.params.taskId;

  if (await checkTaskerClaimedTask(ethAddress, taskId))
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
});

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("taskerAbandonTask", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const taskId = request.params.taskId;

  if (!(await checkTaskerClaimedTask(ethAddress, taskId)))
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
});

/* ------------------------------------------------------------------- */
