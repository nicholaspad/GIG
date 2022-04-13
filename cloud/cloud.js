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
        maxReward: 1,
        requesterId: 1,
        numResponses: 1,
        maxResponses: 1,
        status: 1,
      },
    },
  ]);

  const claimedTaskIds = {};
  (await getTaskerClaimedTaskIds(ethAddress)).forEach((task) => {
    claimedTaskIds[task["taskId"]] = 1;
  });

  /*
    Filters:
      1. Remove tasks already claimed by the user
      2. Remove tasks that have reached the claim limit
      3. Remove tasks that, upon claiming, would go over the ETH allocation
      4. Remove tasks that are not in progress
  */
  return res.filter((task) => {
    return (
      !(task["objectId"] in claimedTaskIds) &&
      task["numResponses"] < task["maxResponses"] &&
      task["maxReward"] - (task["numResponses"] + 1) * task["unitReward"] >=
        0 &&
      task["status"] === 0
    );
  });
});

/* ------------------------------------------------------------------- */

Moralis.Cloud.define("getTaskerMyTasksTableData", async (request) => {
  const ethAddress = request.user.get("ethAddress");
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = await query.aggregate([
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

  /*
    Filters:
      1. Remove tasks claims that are in progress, but the task is not in progress
  */
  return res.filter((task) => {
    if (task["tasks"].length !== 1) return false;
    if (task["status"] === 0 && task["tasks"][0]["status"] !== 0) return false;
    return true;
  });
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
  const ClaimCheckOutcome = {
    GOOD: "GOOD",
    OTHER: "OTHER",
    BOTH: "BOTH",
    RESPONSES: "RESPONSES",
    ETH: "ETH",
    BAD_STATUS: "BAD_STATUS",
  };

  async function incrementNumTaskers(taskId) {
    const tableName = "Tasks";

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.equalTo("objectId", taskId).first();

    res.set("numResponses", res.get("numResponses") + 1);
    await res.save();
  }

  async function checkClaimAvailability(taskId) {
    const tableName = "Tasks";

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.equalTo("objectId", taskId).find();

    if (res.length !== 1) return ClaimCheckOutcome.OTHER;

    const task = res[0];
    const blameResponses = task.get("numResponses") >= task.get("maxResponses");
    const blameETH =
      task.get("maxReward") -
        (task.get("numResponses") + 1) * task.get("unitReward") <
      0;
    const blameStatus = task.get("status") !== 0;

    if (blameResponses && blameETH) return ClaimCheckOutcome.BOTH;
    if (blameResponses) return ClaimCheckOutcome.RESPONSES;
    if (blameETH) return ClaimCheckOutcome.ETH;
    if (blameStatus) return ClaimCheckOutcome.BAD_STATUS;

    return ClaimCheckOutcome.GOOD;
  }

  const ethAddress = request.user.get("ethAddress");
  const taskId = request.params.taskId;

  const check = await checkClaimAvailability(taskId);
  if (check === ClaimCheckOutcome.OTHER)
    return {
      success: false,
      message: `Address ${ethAddress} failed to claim task ${taskId}: reason unknown`,
    };
  if (check === ClaimCheckOutcome.BOTH)
    return {
      success: false,
      message: `Address ${ethAddress} failed to claim task ${taskId}: Tasker limit and ETH allocation both exceeded`,
    };
  if (check === ClaimCheckOutcome.RESPONSES)
    return {
      success: false,
      message: `Address ${ethAddress} failed to claim task ${taskId}: Tasker limit exceeded`,
    };
  if (check === ClaimCheckOutcome.ETH)
    return {
      success: false,
      message: `Address ${ethAddress} failed to claim task ${taskId}: ETH allocation exceeded`,
    };
  if (check === ClaimCheckOutcome.BAD_STATUS)
    return {
      success: false,
      message: `Address ${ethAddress} failed to claim task ${taskId}: task is no longer in progress`,
    };

  if (await checkTaskerClaimedTask(ethAddress, taskId))
    return {
      success: false,
      message: `Address ${ethAddress} has already claimed task ${taskId}.`,
    };

  // At this point, it is safe to proceed with the task claim operation

  await incrementNumTaskers(taskId);

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
  async function decrementNumTaskers(taskId) {
    const tableName = "Tasks";

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.equalTo("objectId", taskId).first();

    // Handles case where Requester has abandoned task, so query result is null
    if (!res) return;

    // Do not affect numResponses count if task is no longer in progress
    if (res.get("status") !== 0) return;

    res.set("numResponses", res.get("numResponses") - 1);
    await res.save();
  }

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

  if (!res)
    return {
      success: false,
      message: `Address ${ethAddress} failed to abandon task ${taskId}: task is not claimed`,
    };

  // Do not allow task abandonment if its status is not in progress
  if (res.get("status") !== 0)
    return {
      success: false,
      message: `Address ${ethAddress} failed to abandon task ${taskId}: task is not in progress`,
    };

  return res.destroy().then(
    async () => {
      await decrementNumTaskers(taskId);
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

Moralis.Cloud.define("createTask", async (request) => {
  function validateNewTask(newTask, maxReward, maxResponses, config) {
    const MIN_TASKERS = Number(config.get("NEXT_PUBLIC_MIN_TASKERS"));
    const MIN_TASK_DATA_CHARS = Number(
      config.get("NEXT_PUBLIC_MIN_TASK_DATA_CHARS")
    );
    const MIN_ETH = Number(config.get("NEXT_PUBLIC_MIN_ETH"));

    if (maxReward < MIN_ETH) return false;
    if (maxResponses < MIN_TASKERS) return false;
    if (!Number.isInteger(maxResponses)) return false;
    if (newTask["title"].length < MIN_TASK_DATA_CHARS) return false;
    if (newTask["description"].length < MIN_TASK_DATA_CHARS) return false;
    if (
      newTask["options"].some(
        (question) => question["question"].length < MIN_TASK_DATA_CHARS
      )
    )
      return false;
    if (
      newTask["options"].some((question) => {
        // See enum QuestionType for type IDs

        // Multiple choice
        if (question["type"] === 0) {
          // Check that number of choices is in [1, 5]
          if (question["options"].length < 1 || question["options"].length > 5)
            return true;
        }

        // All question-specific checks passed
        return false;
      })
    )
      return false;

    // All checks passed at this point
    return true;
  }

  const ethAddress = request.user.get("ethAddress");
  const newTask = request.params.newTask;
  const maxReward = Number(request.params.maxReward);
  const maxResponses = Number(request.params.maxResponses);
  const tableName = "Tasks";
  const config = await Moralis.Config.get({ useMasterKey: true });

  if (!validateNewTask(newTask, maxReward, maxResponses, config))
    return {
      success: false,
      message: `Address ${ethAddress} failed to create task "${newTask["title"]}": please provide valid inputs`,
    };

  const Tasks = Moralis.Object.extend(tableName);

  const task = new Tasks();
  task.set("requesterId", ethAddress);
  task.set("title", newTask["title"]);
  task.set("description", newTask["description"]);
  task.set("startDate", new Date());
  task.set("status", 0); // "in progress"
  task.set(
    "estCompletionTime",
    Math.ceil((newTask["options"].length * 30) / 60)
  ); // approx 30 seconds per question @bzzbbz @christine-sun @jennsun @nicholaspad
  task.set("avgRating", -1);
  task.set("numResponses", 0);
  task.set("maxResponses", maxResponses);
  task.set("unitReward", config.get("NEXT_PUBLIC_UNIT_ETH_REWARD")); // currently 0.00001 @bzzbbz @christine-sun @jennsun @nicholaspad
  task.set("maxReward", maxReward);
  await task.save();

  return {
    success: true,
    message: `Address ${ethAddress} succesfully created task "${newTask["title"]}"!`,
  };
});
