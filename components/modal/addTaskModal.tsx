import { UniqueIdentifier } from "@dnd-kit/core";
import {
  Button,
  Stack,
  Field,
  Input,
  Icon,
  Flex,
  Text,
  Textarea
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleDatepicker } from "../ui/datepicker/datepicker";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogCloseTrigger,
  DialogFooter,
  DialogActionTrigger,
} from "@/components/ui/dialog";
import { HiPlus } from "react-icons/hi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import cloneDeep from "lodash/cloneDeep";
import { postTasks } from "@/store/tasks";

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

export default function AddTaskModal({
  containerId,
}: {
  containerId: UniqueIdentifier;
}) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tasksStore = useSelector((state: RootState) => state.tasksStore);
  const items = tasksStore.tasks;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadline: new Date(), // ✅ 让 react-hook-form 处理日期
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newItems = cloneDeep(items);

    const submitData = {
      ...data,
      deadline: data.deadline.toISOString(),
      id: crypto.randomUUID(),
      createTime: new Date().toISOString(),
      creator: "User",
      board: containerId,
    };
    newItems[containerId] = newItems[containerId]
      ? [...newItems[containerId], submitData]
      : [submitData];
    try {
      await dispatch(postTasks(newItems));
      setOpen(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <>
      <DialogRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger>
          <Flex
            gap="1"
            alignItems="center"
            className="hover:cursor-pointer text-cyan-900 hover:text-cyan-700"
          >
            <Icon fontSize="20px" color="teal">
              <HiPlus />
            </Icon>
            <Text textStyle="md">Add a card</Text>
          </Flex>
        </DialogTrigger>
        <DialogContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" maxW="sm" css={{ "--field-label-width": "96px" }}>
              <Field.Root invalid={!!errors.title}>
                <Field.Label>Title</Field.Label>
                <Input placeholder="title" {...register("title")} />
                {errors.title && (
                  <Field.ErrorText className="text-red-500">
                    {errors.title.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.description}>
                <Field.Label>description</Field.Label>
                <Textarea placeholder="description" {...register("description")} />
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
                  onDateChange={(date) => setValue("deadline", date)}
                  {...register("deadline")}
                />
              </Field.Root>
            </Stack>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">返回</Button>
              </DialogActionTrigger>
              <Button type="submit">新增</Button>
            </DialogFooter>
          </form>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
}
