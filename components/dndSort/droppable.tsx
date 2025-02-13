import { UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { Card, Flex, Input } from "@chakra-ui/react";
import { HiOutlineDotsVertical, HiOutlineTrash } from "react-icons/hi";
import { CSS } from "@dnd-kit/utilities";
import AddTask from "@/components/modal/addTaskModal";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { postBoards, postTasks } from "@/store/tasks";
import cloneDeep from "lodash/cloneDeep";

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export default function Droppable({
  children,
  container,
  ...props
}: {
  container: { title: string; id: UniqueIdentifier };
  children?: React.ReactNode;
  addCard?: () => void;
}) {
  const tasksStore = useSelector((state: RootState) => state.tasksStore);
  const tasks = tasksStore.tasks;
  const boards = tasksStore.boards;

  const dispatch = useDispatch<AppDispatch>();

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

  const handleDeleteBoard = async () => {
    const newBoards = boards.filter((i) => i.id !== container.id);
    const newTasks = cloneDeep(tasks);
    delete newTasks[container.id];
    try {
      await dispatch(postBoards(newBoards));
      await dispatch(postTasks(newTasks));
    } catch (e) {
      console.log("error", e);
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [inputTitle, setInputTitle] = useState(container.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnBlur = async () => {

    const newBoards = boards.map((board) =>
      board.id === container.id ? { ...board, title: inputTitle } : board
    );
    try {
      await dispatch(postBoards(newBoards));
      setIsEdit(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value);
  };

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    }
  }, [isEdit]);

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
      <Card.Header>
        <Flex justifyContent="space-between" gap="2">
          {!isEdit && (
            <div onDoubleClick={handleDoubleClick} className="flex-1">
              {container.title}
            </div>
          )}
          {isEdit && (
            <Input
              ref={inputRef}
              variant="outline"
              value={inputTitle}
              onBlur={handleOnBlur}
              onChange={handleChange}
            />
          )}
          <Flex gap="2">
            <HiOutlineTrash
              className="hover:text-red-500 hover:cursor-pointer text-neutral-200"
              onClick={handleDeleteBoard}
            />
            <HiOutlineDotsVertical {...attributes} {...listeners} />
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body gap="1">{children}</Card.Body>
      <Card.Footer justifyContent="flex-start">
        <AddTask containerId={container.id} />
      </Card.Footer>
    </Card.Root>
  );
}
