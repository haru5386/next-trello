import React, { FC } from "react";
import {
  useSortable,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Card, Text, Flex } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/util/format";
import { Task } from "@/store/tasks";
interface SortableProps {
  id: UniqueIdentifier;
  item: Task
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const SortableItem: FC<SortableProps> = ({ id, item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
    animateLayoutChanges
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card.Root
      width="100%"
      variant="outline"
      ref={setNodeRef}
      style={style}
      key={id}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-50 " : ""}
    >
      <Card.Body gap="1">
        <Card.Title>{item.title}</Card.Title>
        <Flex justifyContent="space-between" alignItems="center">
          <Text textStyle="xs" color="gray.400">
            {formatDate(new Date(item.deadline))}
          </Text>
          <Avatar
            src="https://picsum.photos/200/300"
            name="Nue Camp"
            size="xs"
          />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default SortableItem;
