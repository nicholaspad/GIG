import MoralisType from "moralis";
import TaskDetails from "../pages/tasker/task-details/[taskId]";
import { GenericResponse, TaskProps } from "./Types";

/*
  Edit the below functions on the Moralis Dashboard (Cloud Functions) or by
  using the CLI and editing the cloud/cloud.js file (see the bottom
  of the Cloud Functions popup on the Moralis Dashboard).
*/

export async function checkTaskerClaimedTask(
  Moralis: MoralisType,
  taskId: string
): Promise<boolean> {
  return await Moralis.Cloud.run("checkTaskerClaimedTask", { taskId: taskId });
}

export async function checkTaskerSubmittedTask(
  Moralis: MoralisType,
  taskId: string
): Promise<boolean> {
  return await Moralis.Cloud.run("checkTaskerSubmittedTask", {
    taskId: taskId,
  });
}

/*
  Creates a new user row in table Users if it doesn't already exist.
  Uses ethAddress as the primary key. Returns the user's data as a
  MoralisType.Object.
*/
export async function makeOrGetNewUser(
  Moralis: MoralisType
): Promise<MoralisType.Object> {
  return await Moralis.Cloud.run("makeOrGetNewUser");
}

/*
  Retrieves data for the Browse Tasks table.
*/
export async function getBrowseTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getBrowseTasksTableData");
}

/*
  Retrieves data for the My Tasks (Tasker) table.
*/
export async function getTaskerMyTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskerMyTasksTableData");
}

/*
  Retrieves data for the Created Tasks (Requester) table.
*/
export async function getRequesterCreatedTasksTableData(
  Moralis: MoralisType
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getRequesterCreatedTasksTableData");
}

/*
  Retrieves data for the Task Details and Task Overview pages.
*/
export async function getTaskOverviewData(
  Moralis: MoralisType,
  taskId: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskOverviewData", { taskId: taskId });
}

/*
  Claims a task (Tasker functionality).
*/
export async function taskerClaimTask(
  Moralis: MoralisType,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("taskerClaimTask", { taskId: taskId });
}

/*
  Abandons a task (Tasker functionality).
*/
export async function taskerAbandonTask(
  Moralis: MoralisType,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("taskerAbandonTask", { taskId: taskId });
}

/*
  Abandons a task (Requester functionality).
*/
export async function requesterAbandonTask(
  Moralis: MoralisType,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("requesterAbandonTask", { taskId: taskId });
}

/* 
  Post a new task (Requester functionality).
*/
export async function createTask(
  Moralis: MoralisType,
  newTask: TaskProps,
  cryptoAllocated: number,
  maxTaskers: number,
  contractAddress: string
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("createTask", {
    newTask: newTask,
    maxRewardETH: cryptoAllocated,
    maxResponses: maxTaskers,
    contractAddress: contractAddress,
  });
}

/* Retrieves task data for form completion pages. */
export async function getTaskFormData(
  Moralis: MoralisType,
  taskId: string
): Promise<TaskProps | null> {
  return await Moralis.Cloud.run("getTaskFormData", {
    taskId: taskId,
  });
}

/* Posts response data for form completion pages. */
export async function postTaskFormData(
  Moralis: MoralisType,
  taskId: string,
  responses: GenericResponse[]
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("postTaskFormData", {
    taskId: taskId,
    responses: responses,
  });
}

export async function getTaskResponses(
  Moralis: MoralisType,
  taskId: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskResponses", {
    taskId: taskId,
  })
}

export async function getTaskUsers(
  Moralis: MoralisType,
  taskId: string
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getTaskUsers", {
    taskId: taskId,
  })
}

export async function getUserResponse(
  Moralis: MoralisType,
  taskId: string,
  userId: string,
): Promise<MoralisType.Object<MoralisType.Attributes>[]> {
  return await Moralis.Cloud.run("getUserResponse", {
    taskId: taskId,
    userId: userId,
  })
}

export async function updateApprovalStatus(
  Moralis: MoralisType,
  objectId: string,
  newStatus: number,
  taskId: string,
): Promise<{ success: boolean; message: string }> {
  return await Moralis.Cloud.run("updateApprovalStatus", {
    objectId: objectId,
    newStatus: newStatus,
    taskId: taskId,
  })
}

export async function getTaskFormDataForView(
  Moralis: MoralisType,
  taskId: string,
  taskerId: string
): Promise<TaskProps | null> {
  return await Moralis.Cloud.run("getTaskFormDataForView", {
    taskId: taskId,
    taskerId: taskerId,
  });
}

