import Modal from "@/components/modal/index";
import { Button, Stack, Field, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleDatepicker } from "../ui/datepicker/datepicker";

interface IFormInput {
  title: string;
  description: string;
  deadline: string;
}

const formSchema = z.object({
  title: z.string().min(2, "標題至少需要 2 個字"),
  description: z.string().min(2, "描述至少需要 2 個字"),
});

export default function AddTaskModal({
  onClose,
  isOpen,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<{ open: () => void; close: () => void } | null>(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) modalRef.current?.open();
    else modalRef.current?.close();
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };
  // const handleConfirm:FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault()
  //   console.log('e',e)
  //   console.log("handleConfirm");
  // };

  return (
    <Modal ref={modalRef} onCancel={onClose}>
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
            <Input placeholder="description" {...register("description")} />
            {errors.description && (
              <Field.ErrorText className="text-red-500">
                {errors.description.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.deadline}>
            <Field.Label>deadline</Field.Label>
            <Input placeholder="me@example.com" {...register("deadline")} />
            {errors.deadline && (
              <Field.ErrorText className="text-red-500">
                {errors.deadline.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.deadline}>
            <Field.Label>deadline</Field.Label>
            <SingleDatepicker
              name="date-input"
              date={date}
              onDateChange={setDate}
            />
            <div>{date.toISOString()}</div>
          </Field.Root>

          {/* id: "task-id1", // UniqueIdentifier 类型
        title: "New Task",
        description: "Task description",
        deadline: "2025-02-05",
        creator: "User",
        createTime: new Date().toISOString(), */}

          <Field.Root orientation="horizontal">
            <Field.Label>Hide email</Field.Label>
          </Field.Root>
        </Stack>

        <Button type="submit">新增</Button>
      </form>
    </Modal>
  );
}
