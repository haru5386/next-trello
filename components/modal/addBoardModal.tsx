import {
  Button,
  Stack,
  Field,
  Input,
  Icon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { postBoards, postTasks } from "@/store/tasks";

interface IFormInput {
  title: string;
}

const formSchema = z.object({
  title: z.string().min(2, "標題至少需要 2 個字"),
});

export default function AddBoardModal() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const tasksStore = useSelector((state: RootState) => state.tasksStore);
  const boards = tasksStore.boards;
  const tasks = tasksStore.tasks;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newBoard = cloneDeep(boards);
    const newTask = cloneDeep(tasks);

    const submitData = {
      ...data,
      id: crypto.randomUUID(),
    };
    newBoard.push(submitData);
    newTask[submitData.id] = [];
    try {
      await dispatch(postBoards(newBoard));
      await dispatch(postTasks(newTask));
      setOpen(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <>
      <DialogRoot size="sm" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger>
          <Flex
            gap="1"
            alignItems="center"
            className="hover:cursor-pointer text-cyan-900 hover:text-cyan-700"
          >
            <Icon fontSize="20px" color="teal">
              <HiPlus />
            </Icon>
            <Text textStyle="md">Add Board</Text>
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
