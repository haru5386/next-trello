"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
  MeasuringStrategy,
  DropAnimation,
  defaultDropAnimationSideEffects,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import Droppable from "./droppable";

import SortableItem from "./sortableItem";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { postBoards, postTasks, fetchTasks, fetchBoards } from "@/store/tasks";
import cloneDeep from "lodash/cloneDeep";
import { Task } from "@/store/tasks";
const TRASH_ID = "TRASH";

export default function DndSort() {
  // 🔹 使用 useSelector 讀取 Redux 狀態
  const tasksStore = useSelector((state: RootState) => state.tasksStore);
  const items = tasksStore.tasks;
  const containers = tasksStore.boards;

  const dispatch = useDispatch<AppDispatch>();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const defaultTask: Task = {
    id: "default",
    title: "Default Task",
    description: "This is a fallback task",
    deadline: new Date().toISOString(),
    creator: "System",
    createTime: new Date().toISOString(),
  };

  const selectItem = (): Task => {
    for (const key of Object.keys(items)) {
      const foundItem = items[key].find((item) => item.id === activeId);
      if (foundItem) return foundItem;
    }
    return defaultTask; // 确保返回一个默认 Task
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchBoards());
  }, [dispatch]);

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) return id;
    return Object.keys(items).find((key) =>
      items[key].some((i) => i.id === id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 移動 container
      if (active.id in items && over?.id) {
        const activeIndex = containers.findIndex(
          (board) => board.id === active.id
        );
        const overIndex = containers.findIndex((board) => board.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newBoards = arrayMove(containers, activeIndex, overIndex);
          dispatch(postBoards(newBoards)); // 更新 Redux store 並發送 API 請求
        }
      }

      // 移動 item
      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActiveId(null);
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setActiveId(null);
        return;
      }

      // 如果是丟到垃圾桶，就從container中移除
      // if (overId === TRASH_ID) {
      //   setItems((items) => ({
      //     ...items,
      //     [activeContainer]: items[activeContainer].filter(
      //       (id) => id !== activeId
      //     ),
      //   }));
      //   setActiveId(null);
      //   return;
      // }

      // if (overId === PLACEHOLDER_ID) {
      //   const newContainerId = getNextContainerId();

      //   unstable_batchedUpdates(() => {
      //     setContainers((containers) => [...containers, newContainerId]);
      //     setItems((items) => ({
      //       ...items,
      //       [activeContainer]: items[activeContainer].filter(
      //         (id) => id !== activeId
      //       ),
      //       [newContainerId]: [active.id],
      //     }));
      //     setActiveId(null);
      //   });
      //   return;
      // }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeIndex = items[activeContainer].findIndex(
          (task) => task.id === active.id
        );
        const overIndex = items[overContainer].findIndex(
          (task) => task.id === overId
        );

        if (activeIndex !== overIndex) {
          const newItems = cloneDeep(items);
          newItems[overContainer] = arrayMove(
            newItems[overContainer],
            activeIndex,
            overIndex
          );

          // 發送更新後的數據到 Redux
          dispatch(postTasks(newItems));
        }
      }

      setActiveId(null);
    }
  };

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (overId == null || overId === TRASH_ID || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const overIndex = overItems.findIndex((item) => item.id === overId);
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );

      let newIndex: number;

      if (overId in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      recentlyMovedToNewContainer.current = true;

      const newItems = {
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (item) => item.id !== active.id
        ),
        [overContainer]: [
          ...items[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...items[overContainer].slice(newIndex, items[overContainer].length),
        ],
      };

      dispatch(postTasks(newItems)); // 更新 Redux store 並發送 API 請求
    }
  };


  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

const handleAddCard = ()=>{
  console.log('handle add task')
}


  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActiveId(active.id);
      }}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="flex gap-2">
        <SortableContext
          items={containers}
          strategy={horizontalListSortingStrategy}
        >
          {containers &&
            containers.map((container) => (
              <Droppable key={container.id} id={container.id} addCard={handleAddCard}>
                <SortableContext
                  items={containers}
                  strategy={verticalListSortingStrategy}
                >
                  {items[container.id]?.map((i) => (
                    <SortableItem key={i.id} id={i.id} item={i}></SortableItem>
                  ))}
                </SortableContext>
              </Droppable>
            ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            containers.some((container) => container.id === activeId) ? (
              <Droppable id={activeId}>
                {items[activeId].map((i) => (
                  <SortableItem key={i.id} id={i.id} item={i}></SortableItem>
                ))}
              </Droppable>
            ) : (
              <SortableItem id={activeId} item={selectItem()}/>
            )
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
