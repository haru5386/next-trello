"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useState, use, useEffect, MouseEvent } from "react";
import { Button, Stack, Field, Input } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash/cloneDeep";
import { postTasks, Task } from "@/store/tasks";
import { SingleDatepicker } from "../ui/datepicker/datepicker";

interface IFormInput {
  title: string;
  description: string;
  deadline: Date;
}

const formSchema = z.object({
  title: z.string().min(2, "標題至少需要 2 個字"),
  description: z.string().min(2, "描述至少需要 2 個字"),
  deadline: z.date({ required_error: "請選擇截止日期" }),
});

type TaskProps = {
  params: Promise<{ id: string; board: string }>;
  onCancel: () => void;
};

export default function TaskItem({ params, onCancel }: TaskProps) {
  const taskStore = useSelector((state: RootState) => state.tasksStore);
  const dispatch = useDispatch<AppDispatch>();
  const [isEdit, setIsEdit] = useState(false);
  const { id, board } = use(params);

  const tasks = taskStore.tasks;
  const isLoading = taskStore.loading;

  const task = tasks[board]?.filter((item) => item.id === id)[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newItems = cloneDeep(tasks);

    const submitData = {
      ...task,
      ...data,
      deadline: data.deadline.toISOString(),
      createTime: new Date().toISOString(),
      creator: "User",
      board: board,
    };
    const index = newItems[board].findIndex((item: Task) => item.id === id);
    newItems[board][index] = submitData;

    try {
      await dispatch(postTasks(newItems));
        setIsEdit(false)
    } catch (e) {
      console.log("error", e);
        setIsEdit(false)
    }
  };
  
  const handleDelete = async(e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    const newItems = cloneDeep(tasks);

    const newBoard = tasks[board].filter((item:Task)=> item.id !== id)
    newItems[board] = newBoard
    try {
        await dispatch(postTasks(newItems));
          setIsEdit(false)
          onCancel()
      } catch (e) {
        console.log("error", e);
          setIsEdit(false)
      }
  }

  useEffect(() => {
    if (task?.title) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("deadline", new Date(task.deadline));
    }
  }, [task, setValue]);

  if(isLoading) {
    return <>is Loading</>
  }

  const footAction = (
    <Stack direction="row">
      <Button variant="outline" onClick={onCancel}>
        返回
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log("編輯");
          setIsEdit(true);
        }}
      >
        編輯
      </Button>
    </Stack>
  );
  console.log("isEdit", isEdit);
  const editFootAction = (
    <Stack direction="row">
      <Button variant="outline" onClick={() => setIsEdit(false)}>
        取消
      </Button>
      <Button type="submit">確認</Button>
      <Button type="button" colorPalette='red' variant="outline" onClick={handleDelete}>刪除</Button>
    </Stack>
  );

  return (
    <>
      {task ? (
        <form onSubmit={handleSubmit(onSubmit)}>

          <Stack gap="4" maxW="sm" css={{ "--field-label-width": "96px" }}>
            <Field.Root invalid={!!errors.title}>
              <Field.Label>Title</Field.Label>
              <Input
                placeholder="title"
                {...register("title")}
                disabled={!isEdit}
              />
              {errors.title && (
                <Field.ErrorText className="text-red-500">
                  {errors.title.message}
                </Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.description}>
              <Field.Label>description</Field.Label>
              <Input
                placeholder="description"
                {...register("description")}
                disabled={!isEdit}
              />
              {errors.description && (
                <Field.ErrorText className="text-red-500">
                  {errors.description.message}
                </Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.deadline}>
              <Field.Label>deadline</Field.Label>
              <SingleDatepicker
                date={watch("deadline")}
                disabled={!isEdit}
                onDateChange={(date) => setValue("deadline", date)}
                {...register("deadline")}
              />
            </Field.Root>
            {isEdit ? editFootAction : footAction}
          </Stack>
        </form>
      ) : (
        <div>no filter data!</div>
      )}
    </>
  );
}
