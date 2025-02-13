"use client";
import { useRouter } from "next/navigation";
import TaskItem from '@/components/task/task'
import { CloseButton } from "@/components/ui/close-button";

type TaskProps = {
  params: Promise<{ id: string,board: string; }>,
};

export default function TaskDetail({ params }:TaskProps) {
  const router = useRouter();
  const handleCancel = () => router.back()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[50vw]">
        <CloseButton onClick={handleCancel} className="absolute top-1 right-1" />
        <TaskItem params={params}  onCancel={handleCancel}/>
      </div>
    </div>
  );
}
