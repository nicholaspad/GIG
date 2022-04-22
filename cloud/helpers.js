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
