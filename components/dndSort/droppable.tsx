import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { Card, Flex } from "@chakra-ui/react";
import {  HiOutlineDotsVertical } from "react-icons/hi";
import { CSS } from "@dnd-kit/utilities";
import AddTask from '@/components/modal/addTaskModal'

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export default function Droppable({
  children,
  container,
  ...props
}:  {
  container: {title: string; id:UniqueIdentifier};
  children?: React.ReactNode;
  addCard?: ()=>void
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: container.id,
    data: {
      type: "container",
    },
    animateLayoutChanges,
  });


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card.Root
      ref={setNodeRef}
      width="320px"
      variant="subtle"
      key={container.id}
      style={style}
      className={
        isDragging ? "opacity-50 inline-block mr-4" : "inline-block mr-4"
      }
      {...props}
    > 
      <Card.Header >
        <Flex justifyContent="space-between" gap="2">
        <div>{container.title}</div>
        <HiOutlineDotsVertical {...attributes} {...listeners} />
        </Flex>
      </Card.Header>
      <Card.Body gap="1">{children}</Card.Body>
      <Card.Footer justifyContent="flex-start">
       <AddTask containerId={container.id}/>
      </Card.Footer>
    </Card.Root>
  );
}
