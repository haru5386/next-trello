import React from "react";
import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import { Button } from "@chakra-ui/react";

export default function Draggable({
  children,
  id
}: Readonly<{
  children: React.ReactNode;
  id: UniqueIdentifier
}>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Button>
  );
}
