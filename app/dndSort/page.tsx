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
import { createRange } from "@/util/createRange";

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
const TRASH_ID = "TRASH";

export default function DndSort() {



  const [items, setItems] = useState<Items>({
    A: createRange(3, (index) => `A${index + 1}`),
    B: createRange(3, (index) => `B${index + 1}`),
    C: createRange(3, (index) => `C${index + 1}`),
    D: createRange(3, (index) => `D${index + 1}`),
  });
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 移動 container
      if (active.id in items && over?.id) {
        setContainers((containers) => {
          const activeIndex = containers.indexOf(active.id);
          const overIndex = containers.indexOf(over.id);

          return arrayMove(containers, activeIndex, overIndex);
        });
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
      if (overId === TRASH_ID) {
        setItems((items) => ({
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (id) => id !== activeId
          ),
        }));
        setActiveId(null);
        return;
      }

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
        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(overId);

        if (activeIndex !== overIndex) {
          setItems((items) => ({
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            ),
          }));
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
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }
        recentlyMovedToNewContainer.current = true;

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
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
          {containers.map((item) => (
            <Droppable key={item} id={item}>
              <SortableContext
                items={containers}
                strategy={verticalListSortingStrategy}
              >
                {items[item].map((id) => (
                  <SortableItem key={id} id={id}></SortableItem>
                ))}
              </SortableContext>
            </Droppable>
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            containers.includes(activeId) ? (
              <Droppable id={activeId}>
                {items[activeId].map((id) => (
                  <SortableItem key={id} id={id}></SortableItem>
                ))}
              </Droppable>
            ) : (
              <SortableItem id={activeId} />
            )
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
