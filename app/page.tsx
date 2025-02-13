"use client";
import Board from "../components/dndSort/index";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { Button, Flex } from "@chakra-ui/react";
import { postTasks, postBoards } from "@/store/tasks";
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  // const boardId = "board-id2"; // 假设这是一个有效的 BoardId

  // // 使用 dispatch 来调用 addTask
  // const handleAddTask = () => {
  //   dispatch(
  //     tasksAction.addTask({
  //       task, // 任务对象
  //       board: boardId, // 板子的 ID
  //     })
  //   );
  // };

  // const handleAddAPITask = async () => {
  //   // const newTasks = cloneDeep(tasks);
  //   // console.log('cloneDeep',tasks)
  //   // if(newTasks[boardId]) {
  //   //   newTasks[boardId].push(task);
  //   // } else {
  //   //   newTasks[boardId] = [task]
  //   // }
  //   // console.log('newTasks',newTasks)

  //   const newTasks = {
  //     boardId1: [
  //       {
  //         id: "task-id1", // UniqueIdentifier 类型
  //         title: "New Task4",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'
  //       },
  //       {
  //         id: "task-id2", // UniqueIdentifier 类型
  //         title: "New Task5",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'

  //       },
  //       {
  //         id: "task-id3", // UniqueIdentifier 类型
  //         title: "New Task6",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'

  //       },
  //     ],
  //     boardId2: [
  //       {
  //         id: "task2-id1", // UniqueIdentifier 类型
  //         title: "New Task1",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'

  //       },
  //       {
  //         id: "task2-id2", // UniqueIdentifier 类型
  //         title: "New Task2",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'

  //       },
  //       {
  //         id: "task2-id3", // UniqueIdentifier 类型
  //         title: "New Task3",
  //         description: "Task description",
  //         deadline: "2025-02-05",
  //         creator: "User",
  //         createTime: new Date().toISOString(),
  //         board: 'boardId1'
  //       },
  //     ],
  //   };

  //   await dispatch(postTasks(newTasks));
  // };

  // // 使用 dispatch 来调用 addBoard
  // const handleAddBoard = async () => {
  //   await dispatch(
  //     postBoards([
  //       {
  //         id: "boardId1", // 任务对象
  //         title: "title1", // 板子的 ID
  //       },
  //       {
  //         id: "boardId2", // 任务对象
  //         title: "title2", // 板子的 ID
  //       },
  //     ])
  //   );
  // };

  return (
    <>
      {/* <Button onClick={handleAddBoard}>Add Board</Button>
      <Button onClick={handleAddAPITask}>Add API Task</Button> */}
      <Board />
    </>
  );
}
