import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { Button, Card, Icon, Flex } from "@chakra-ui/react";
import { HiPlus, HiOutlineDotsVertical } from "react-icons/hi";
import { CSS } from "@dnd-kit/utilities";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export default function Droppable({
  children,
  id,
  addCard,
  ...props
}:  {
  id: UniqueIdentifier;
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
    id,
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
      key={id}
      style={style}
      className={
        isDragging ? "opacity-50 inline-block mr-4" : "inline-block mr-4"
      }
      {...props}
    > 
      <Card.Header >
        <Flex justifyContent="space-between" gap="2">
        <div>{id}</div>
        <HiOutlineDotsVertical {...attributes} {...listeners} />
        </Flex>
      </Card.Header>
      <Card.Body gap="1">{children}</Card.Body>
      <Card.Footer justifyContent="flex-start">
        <Button variant="plain" colorPalette="cyan" onClick={addCard}>
          <Icon fontSize="40px" color="teal">
            <HiPlus />
          </Icon>
          Add a card
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
