import Modal from "@/components/modal/index";
import { Button, Stack, Field, Input } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
export default function AddTaskModal({
  children,
  isOpen,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
}) {
  const modalRef = useRef<{ open: () => void; close: () => void } | null>(null);
  useEffect(() => {
    if (isOpen) modalRef.current?.open();
    else modalRef.current?.close();
  }, [isOpen]);

  const handleConfirm = () => {
    console.log("handleConfirm");
  };
  return (
    <Modal ref={modalRef}>
      <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>
      <Field.Root orientation="horizontal">
        <Field.Label>Title</Field.Label>
        <Input placeholder="標題" flex="1" name="title" />
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label>Email</Field.Label>
        <Input placeholder="me@example.com" flex="1" />
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label>Hide email</Field.Label>
      </Field.Root>
    </Stack>

      <Button onClick={handleConfirm}>新增</Button>
    </Modal>
  );
}
