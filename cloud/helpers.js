/*
  Computes a unit reward value in Wei using the formula:
  toWei(maxReward) / maxTaskers - 1
*/
async function computeUnitRewardWei(maxReward, maxTaskers) {
  const maxRewardWei = Number(
    await Moralis.Cloud.units({
      method: "toWei",
      value: maxReward,
    })
  );
  const unitRewardWei = maxRewardWei / maxTaskers - 1; // ensures that unitRewardWei*maxTaskers < maxRewardWei
  return unitRewardWei.toString();
}

/* 
  Converts a max reward ETH value to Wei:
  toWei(maxReward)
*/
async function computeMaxRewardWei(maxReward) {
  return await Moralis.Cloud.units({
    method: "toWei",
    value: maxReward,
  });
}

/*
  Checks if a task is claimed by a Tasker.
*/
async function checkTaskerClaimedTask(taskerId, taskId) {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = await query
    .equalTo("taskerId", taskerId)
    .equalTo("taskId", taskId)
    .find();

  return res.length > 0;
}

/*
  Checks if a task has already been submitted by a Tasker.
*/
async function checkTaskerSubmittedTask(taskerId, taskId) {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);
  const res = await query
    .equalTo("taskerId", taskerId)
    .equalTo("taskId", taskId)
    .first();

  if (!res) return false;

  return res.get("status") !== 0;
}

/*
  Checks whether a tasker has status "pending verification"
  and has not been rated.
*/
async function checkTaskerTaskHasNotRated(taskerId, taskId) {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);

  const res = await query
    .equalTo("taskerId", taskerId)
    .equalTo("taskId", taskId)
    .first();

  if (!res) return false;

  return res.get("status") === 1 && res.get("hasRated") === false;
}

/*
  Computes a task's average rating given its taskId.
*/
async function computeTaskRating(taskId) {
  const tableName = "TaskUsers";

  const TaskUsers = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(TaskUsers);

  const res = await query.equalTo("taskId", taskId).find();
  if (res.length === 0) return -1;

  let avgRating = 0;
  let countRating = 0;
  res.forEach((task) => {
    if (!task.get("taskerRating")) return;
    avgRating += task.get("taskerRating");
    countRating++;
  });
  if (countRating === 0) return -1;
  return avgRating / countRating;
}

/*
  Computes a requester's average rating given a requesterId.
*/
async function computeRequesterRating(requesterId) {
  const tableName = "Tasks";

  const Tasks = Moralis.Object.extend(tableName);
  const query = new Moralis.Query(Tasks);

  const res = await query.equalTo("requesterId", requesterId).find();
  if (res.length === 0) return -1;

  let avgRating = 0;
  let countRating = 0;
  for (let task of res) {
    const taskRating = await computeTaskRating(task.id);
    if (taskRating === -1) continue;
    avgRating += taskRating;
    countRating++;
  }
  if (countRating === 0) return -1;
  return avgRating / countRating;
}
