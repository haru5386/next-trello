'use client'
import {  useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {useEffect} from 'react'
import TaskItem from '@/components/task/task'
import { fetchTasks, fetchBoards } from "@/store/tasks";
import { useRouter } from "next/navigation"; 

type TaskProps = {
    params: Promise<{ id: string,board: string; }>,
  };
  

export default function Task({ params }:TaskProps) {
      const dispatch = useDispatch<AppDispatch>();
      const router = useRouter()
      
      useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchBoards());
      }, [dispatch]);

  return (
    <>
    <div className="p-5">
      <TaskItem params={params} onCancel={()=>router.push('/')}/>
      </div>
    </>
  );
}
