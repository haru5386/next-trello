"use client";
import React, { useState } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";

import Draggable from "./draggable";
import Droppable from "./droppable";

export default function Dnd() {
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const containers = ["A", "B", "C"];
  const draggableMarkup = <Draggable id="drag">Drag me</Draggable>;

  // function handleDragEnd(event: DragEndEvent) {
  //   if (event.over && event.over.id === "droppable") {
  //     setIsDropped(true);
  //   }
  // }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    console.log('over',over)
    console.log('active',active)

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent((pre)=>over ? over.id : pre);
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} onDragStart={(e)=>{console.log('onDragStart', e)}}>
        {parent === null ? draggableMarkup : null}

        {containers.map((id) => (
          // We updated the Droppable component so it would accept an `id`
          // prop and pass it to `useDroppable`
          <Droppable key={id} id={id}>
            {parent === id ? draggableMarkup : "Drop here"}
          </Droppable>
        ))}
      </DndContext>
    </>
  );
}
