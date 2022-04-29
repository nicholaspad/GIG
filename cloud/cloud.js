Moralis.Cloud.define(
  "checkTaskerTaskHasNotRated",
  async (request) => {
    const ethAddress = request.user.get("ethAddress");
    const taskId = request.params.taskId;
    return await checkTaskerTaskHasNotRated(ethAddress, taskId);
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "checkTaskerClaimedTask",
  async (request) => {
    const ethAddress = request.user.get("ethAddress");
    const taskId = request.params.taskId;
    return await checkTaskerClaimedTask(ethAddress, taskId);
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "checkTaskerSubmittedTask",
  async (request) => {
    const ethAddress = request.user.get("ethAddress");
    const taskId = request.params.taskId;
    return await checkTaskerSubmittedTask(ethAddress, taskId);
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "makeOrGetNewUser",
  async (request) => {
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
  },
  {
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getBrowseTasksTableData",
  async (request) => {
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
      { sort: { unitRewardWei: -1 } },
      {
        project: {
          objectId: 1, // taskId
          title: 1,
          unitRewardWei: 1,
          maxRewardWei: 1,
          requesterId: 1,
          numResponses: 1,
          maxResponses: 1,
          status: 1,
        },
      },
    ]);

    // compute and set average rating (avgRating) for each
    for (let task of res)
      task["avgRating"] = await computeTaskRating(task["objectId"]);

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
        task["maxRewardWei"] -
          (task["numResponses"] + 1) * task["unitRewardWei"] >=
          0 &&
        task["status"] === 0
      );
    });
  },
  {
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskerMyTasksTableData",
  async (request) => {
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
      if (task["status"] === 0 && task["tasks"][0]["status"] !== 0)
        return false;
      return true;
    });
  },
  {
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getRequesterCreatedTasksTableData",
  async (request) => {
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
          unitRewardWei: 1,
          maxRewardWei: 1,
          status: 1,
          numResponses: 1,
          maxResponses: 1,
        },
      },
    ]);

    return res;
  },
  {
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskerClaimedTaskIds",
  async (request) => {
    const ethAddress = request.user.get("ethAddress");
    const tableName = "TaskUsers";

    const TaskUsers = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(TaskUsers);
    const res = query.aggregate([
      { match: { taskerId: ethAddress } },
      { project: { objectId: 0, taskId: 1 } },
    ]);

    return res;
  },
  {
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskOverviewData",
  async (request) => {
    const taskId = request.params.taskId;
    const tableName = "Tasks";

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.aggregate([
      { match: { _id: taskId } },
      {
        project: {
          objectId: 1,
          title: 1,
          description: 1,
          startDate: 1,
          unitRewardWei: 1,
          estCompletionTime: 1,
          requesterId: 1,
        },
      },
    ]);

    // compute and set average rating (avgRating) for each
    for (let task of res)
      task["avgRating"] = await computeRequesterRating(task["requesterId"]);

    return res;
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "taskerClaimTask",
  async (request) => {
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
      const blameResponses =
        task.get("numResponses") >= task.get("maxResponses");
      const blameETH =
        task.get("maxRewardWei") -
          (task.get("numResponses") + 1) * task.get("unitRewardWei") <
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
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "taskerAbandonTask",
  async (request) => {
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
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "requesterAbandonTask",
  async (request) => {
    async function destroyQuestions(taskId) {
      const tableName = "Questions";

      const Questions = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(Questions);
      const res = await query.equalTo("taskId", taskId).find();

      res.forEach(async (e) => await e.destroy());
    }

    async function destroyResponses(taskId) {
      const tableName = "Responses";

      const Responses = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(Responses);
      const res = await query.equalTo("taskId", taskId).find();

      res.forEach(async (e) => await e.destroy());
    }

    async function destroyClaimedTasks(taskId) {
      const verifiedAndPaid = 2;
      const tableName = "TaskUsers";

      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);
      const res = await query
        .equalTo("taskId", taskId)
        .notEqualTo("status", verifiedAndPaid)
        .find();

      res.forEach(async (e) => await e.destroy());
    }

    const ethAddress = request.user.get("ethAddress");
    const taskId = request.params.taskId;
    const tableName = "Tasks";

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query
      .equalTo("requesterId", ethAddress)
      .equalTo("objectId", taskId)
      .first();

    if (!res)
      return {
        success: false,
        message: `Address ${ethAddress} failed to abandon task ${taskId}: address did not create task`,
      };

    // Do not allow task abandonment if its status is not in progress
    if (res.get("status") !== 0)
      return {
        success: false,
        message: `Address ${ethAddress} failed to abandon task ${taskId}: task is not in progress`,
      };

    await destroyQuestions(taskId);
    await destroyResponses(taskId);
    await destroyClaimedTasks(taskId);

    return res.destroy().then(
      async () => {
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
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "createTask",
  async (request) => {
    const QuestionType = {
      SINGLE_CHOICE: 0,
    };

    function validateNewTask(newTask, maxRewardETH, maxResponses, config) {
      const MIN_TASKERS = Number(config.get("NEXT_PUBLIC_MIN_TASKERS"));
      const MIN_TASK_DATA_CHARS = Number(
        config.get("NEXT_PUBLIC_MIN_TASK_DATA_CHARS")
      );
      const MIN_ETH = Number(config.get("NEXT_PUBLIC_MIN_ETH"));

      if (maxRewardETH < MIN_ETH) return false;
      if (maxResponses < MIN_TASKERS) return false;
      if (!Number.isInteger(maxResponses)) return false;
      if (newTask["title"].length < MIN_TASK_DATA_CHARS) return false;
      if (newTask["description"].length < MIN_TASK_DATA_CHARS) return false;
      if (
        newTask["questions"].some(
          (question) => question["question"].length < MIN_TASK_DATA_CHARS
        )
      )
        return false;
      if (
        newTask["questions"].some((question) => {
          switch (question["type"]) {
            case QuestionType.SINGLE_CHOICE:
              const options = question["content"]["options"];
              // Check that number of choices is in [1, 5]
              if (options.length < 1 || options.length > 5) return true;
              return false;
          }

          // Invalid/unknown question type, so fail
          return true;
        })
      )
        return false;

      // All checks passed at this point
      return true;
    }

    async function insertNewTask(
      newTask,
      maxRewardETH,
      maxResponses,
      contractAddress
    ) {
      const tableName = "Tasks";

      const Tasks = Moralis.Object.extend(tableName);

      const task = new Tasks();
      task.set("requesterId", ethAddress);
      task.set("title", newTask["title"]);
      task.set("description", newTask["description"]);
      task.set("startDate", new Date());
      task.set("contractAddress", contractAddress);
      task.set("status", 0); // "in progress"
      task.set(
        "estCompletionTime",
        Math.ceil((newTask["questions"].length * 30) / 60)
      ); // approx 30 seconds per question @bzzbbz @christine-sun @jennsun @nicholaspad
      task.set("numResponses", 0);
      task.set("maxResponses", maxResponses);
      task.set(
        "unitRewardWei",
        await computeUnitRewardWei(maxRewardETH, maxResponses)
      );
      task.set("maxRewardWei", await computeMaxRewardWei(maxRewardETH));
      const res = await task.save();
      return res.id;
    }

    async function insertNewQuestions(newTask, taskId) {
      const tableName = "Questions";

      const Questions = Moralis.Object.extend(tableName);

      newTask["questions"].forEach(async (question, idx) => {
        const q = new Questions();
        q.set("taskId", taskId);
        q.set("type", question["type"]);
        q.set("title", question["question"]);
        q.set("idx", idx);
        q.set("content", question["content"]);
        await q.save();
      });
    }

    const ethAddress = request.user.get("ethAddress");
    const newTask = request.params.newTask;
    const maxRewardETH = request.params.maxRewardETH;
    const maxResponses = Number(request.params.maxResponses);
    const contractAddress = request.params.contractAddress;
    const config = await Moralis.Config.get({ useMasterKey: true });

    if (!validateNewTask(newTask, maxRewardETH, maxResponses, config))
      return {
        success: false,
        message: `Address ${ethAddress} failed to create task "${newTask["title"]}": please provide valid inputs`,
      };

    const taskId = await insertNewTask(
      newTask,
      maxRewardETH,
      maxResponses,
      contractAddress
    );
    await insertNewQuestions(newTask, taskId);

    return {
      success: true,
      message: `Address ${ethAddress} succesfully created task "${newTask["title"]}"!`,
    };
  },
  {
    fields: ["newTask", "maxRewardETH", "maxResponses"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskFormData",
  async (request) => {
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    const tableName = "Tasks";

    if (!(await checkTaskerClaimedTask(ethAddress, taskId))) return null;

    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.equalTo("objectId", taskId).first();

    if (!res) return null;

    return {
      id: res.id,
      title: res.get("title"),
      description: res.get("description"),
      estCompletionTime: res.get("estCompletionTime"),
      questions: await getQuestions(taskId),
    };
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "postTaskFormData",
  async (request) => {
    const QuestionType = {
      SINGLE_CHOICE: 0,
    };

    async function validateResponses(responses, taskerId, taskId) {
      const tableName = "Responses";

      const Responses = Moralis.Object.extend(tableName);
      let query = new Moralis.Query(Responses);

      for (response of responses) {
        // Check whether rows with taskerId + taskId already exist
        let res = await query
          .equalTo("taskerId", taskerId)
          .equalTo("taskId", taskId)
          .first();
        if (res) return false;

        // Check whether rows with questionId + taskId already exist
        res = await query
          .equalTo("questionId", response["questionId"])
          .equalTo("taskId", taskId)
          .first();
        if (res) return false;

        // Check whether questionId is valid
        query = new Moralis.Query(Moralis.Object.extend("Questions"));
        res = await query
          .equalTo("objectId", response["questionId"])
          .equalTo("taskId", taskId)
          .find();
        if (res.length !== 1) return false;

        // Check whether taskId is valid
        query = new Moralis.Query(Moralis.Object.extend("Tasks"));
        res = await query.equalTo("objectId", taskId).find();
        if (res.length !== 1) return false;

        // Check schema of the actual response data
        const r = response["response"];
        switch (response["type"]) {
          case QuestionType.SINGLE_CHOICE:
            const keys = Object.keys(r);
            if (keys.length !== 1) return false;
            if (!keys.includes("idx")) return false;
            if (typeof r["idx"] !== "number") return false;
            break;
        }
      }

      return true;
    }

    async function insertResponses(responses, taskerId, taskId) {
      const tableName = "Responses";

      const Responses = Moralis.Object.extend(tableName);

      responses.forEach(async (response) => {
        const r = new Responses();
        r.set("questionId", response["questionId"]);
        r.set("taskId", taskId);
        r.set("type", response["type"]);
        r.set("taskerId", taskerId);
        r.set("response", response["response"]);
        await r.save();
      });
    }

    async function updateTaskStatus(taskerId, taskId) {
      const tableName = "TaskUsers";

      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);
      const res = await query
        .equalTo("taskerId", taskerId)
        .equalTo("taskId", taskId)
        .first();

      if (!res) return;

      res.set("status", 1);
      res.set("completedDate", new Date());

      await res.save();
    }

    const responses = request.params.responses;
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");

    if (!(await checkTaskerClaimedTask(ethAddress, taskId)))
      return {
        success: false,
        message: `Address ${ethAddress} has not claimed task ${taskId}.`,
      };

    if (await checkTaskerSubmittedTask(ethAddress, taskId))
      return {
        success: false,
        message: `Address ${ethAddress} has already submitted task ${taskId}.`,
      };

    if (!(await validateResponses(responses, ethAddress, taskId)))
      return {
        success: false,
        message: `Response data for task ${taskId} contains malformed data.`,
      };

    await insertResponses(responses, ethAddress, taskId);
    await updateTaskStatus(ethAddress, taskId);

    return {
      success: true,
      message: `Address ${ethAddress} successfully submitted task ${taskId}!`,
    };
  },
  {
    fields: ["responses"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "checkRequesterCreatedTask",
  async (request) => {
    const ethAddress = request.user.get("ethAddress");
    return await checkRequesterCreatedTask(ethAddress, request.params.taskId)
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskResponsesByQuestion",
  async (request) => {
    async function getResponses(taskId) {
      const pipeline = [
        { group: { objectId: "$taskerId", data: { $push: "$$ROOT" }}},
      ];
      tableName = "Responses";
      const Responses = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(Responses);
      const res = await query.equalTo("taskId", taskId).aggregate(pipeline);
      return res;
    }
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return [];
    const responses = getResponses(taskId);
    return responses;
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskApprovedResponsesByTasker",
  async (request) => {
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return [];

    async function aggregateTaskUsers(taskId) {
      const tableName = "TaskUsers";
      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);
      const pipeline = [
        {
          match: {
            $expr: {
              $and: [
                { $eq: ["$taskId", taskId] },
                {
                  $or: [
                  { $eq: ["$status", 2] },
                  { $eq: ["$status", 4] }, 
                  ],
                }
              ],
            },
          },
        },
    
        {
          lookup: {
            from: "Responses",
            let: {taskId: "$taskId", taskerId: "$taskerId"},
            pipeline: [
              {
                 $match: {
                    $expr: {
                       $and: [
                          {
                             $eq: [
                                "$taskId",
                                "$$taskId"
                             ]
                          },
                          {
                             $eq: [
                                "$taskerId",
                                "$$taskerId"
                             ]
                          }
                       ]
                    }
                 }
              }
           ],
            as: "responses",
          },
        },
      ];
      res = await query.aggregate(pipeline);

      return res.map((r) => {
        return {
          taskerId: r.taskerId,
          completedDate: r.completedDate,
          responses: r.responses.map((response) => {
            return {
              idx: response.response.idx,
              questionId: response.questionId,
            }
          }),
        };
      }); 
    }
    const responses = await aggregateTaskUsers(taskId);
    return responses;
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskUsers",
  async (request) => {
    async function getTaskUsers(taskId) {
      tableName = "TaskUsers";
      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);
      query.equalTo("taskId", taskId);
      query.notEqualTo("status", 0);
      query.notEqualTo("status", 3);
      const res = await query.find();
      return res;
    }
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return [];
    const taskUsers = getTaskUsers(taskId);
    return taskUsers;
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getUserResponse",
  async (request) => {
    async function getTaskUsers(taskId, taskerId) {
      tableName = "Responses";
      const Responses = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(Responses);
      query.equalTo("taskId", taskId);
      query.equalTo("userId", taskerId);
      const res = await query.find();
      return res;
    }
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return [];
    const userResponse = getTaskUsers(taskId, request.params.taskerId);
    return userResponse;
  },
  {
    fields: ["taskId", "taskerId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "updateApprovalStatus",
  async (request) => {
    if (request.params.newStatus !== 2 && request.params.newStatus !== 5) {
      return {
        success: false,
        message: 'Task status must be updated to either "approved" or "rejected"'
      };
    }
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId)))  {
      return {
        success: false,
        message: "Approval update failed - unauthorized update!"
      };
    }
    tableName = "TaskUsers";
    const TaskUsers = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(TaskUsers);
    return query.get(request.params.objectId).then(
      (taskUser) => {
        if (taskUser.get("status") !== 1) {
          return {
            success: false, 
            message: "Cannot update status of tasks that are already approved/rejected"
          };
        }
        taskUser.set("status", request.params.newStatus)
        taskUser.save()
        return {
          success: true,
          message: "Successfully updated approval status!"
        };
      },
      (error) => {
        return {
          success: false,
          message: `Failed to update approval status: ${error}`,
        };
      }
    );
  },
  {
    fields: ["objectId", "newStatus", "taskId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "getTaskFormDataForView",
  async (request) => {
    const taskId = request.params.taskId;
    const taskerId = request.params.taskerId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return null;

    async function aggregateResponses(taskId, taskerId) {
      const tableName = "Responses";
      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);
      const pipeline = [
        {
          match: {
            $expr: {
              $and: [
                { $eq: ["$taskId", taskId] },
                { $eq: ["$taskerId", taskerId] },
              ],
            },
          },
        },
    
        {
          lookup: {
            from: "Questions",
            localField: "questionId",
            foreignField: "_id",
            as: "question",
          },
        },
      ];
      return await query.aggregate(pipeline);
    }
    const responses = await aggregateResponses(taskId, taskerId);
    const questionResponses = responses.map((r) => {
      q = r["question"][0];
      return {
        id: q.id,
        type: q["type"],
        idx: q["idx"],
        question: q["title"],
        content: q["content"],
        response: r["response"]["idx"],
      };
    });
  

    const tableName = "Tasks";
    const Tasks = Moralis.Object.extend(tableName);
    const query = new Moralis.Query(Tasks);
    const res = await query.equalTo("objectId", taskId).first();
    if (!res) return null;

    return {
      id: res.id,
      title: res.get("title"),
      description: res.get("description"),
      estCompletionTime: res.get("estCompletionTime"),
      questions: questionResponses,
    };
  },
  {
    fields: ["taskId", "taskerId"],
    requireUser: true,
  }
);

/* ------------------------------------------------------------------- */
Moralis.Cloud.define(
  "getTaskQuestions",
  async (request) => {
    const taskId = request.params.taskId;
    const ethAddress = request.user.get("ethAddress");
    if (!(await checkRequesterCreatedTask(ethAddress, taskId))) return [];
    return await getQuestions(taskId);
  }
);

/* ------------------------------------------------------------------- */

Moralis.Cloud.define(
  "postTaskRating",
  async (request) => {
    async function insertRating(taskerId, task, rating) {
      const tableName = "TaskUsers";

      const TaskUsers = Moralis.Object.extend(tableName);
      const query = new Moralis.Query(TaskUsers);

      const res = await query
        .equalTo("taskerId", taskerId)
        .equalTo("taskId", taskId)
        .first();

      res.set("taskerRating", rating);
      res.set("hasRated", true);

      await res.save();
    }

    const ethAddress = request.user.get("ethAddress");
    const taskId = request.params.taskId;
    const rating = Number(request.params.rating);

    if (!(await checkTaskerTaskHasNotRated(ethAddress, taskId)))
      return {
        success: false,
        message: `Address ${ethAddress} cannot rate task ${taskId}.`,
      };

    if (rating <= 0 || rating > 5)
      return {
        success: false,
        message: `Out of bounds rating for task ${taskId}.`,
      };

    await insertRating(ethAddress, taskId, rating);

    return {
      success: true,
      message: `Address ${ethAddress} successfully rated task ${taskId} as ${rating} stars!`,
    };
  },
  {
    fields: ["taskId"],
    requireUser: true,
  }
);