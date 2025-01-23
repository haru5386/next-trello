import React from 'react';
import {UniqueIdentifier, useDroppable} from '@dnd-kit/core';

export default function Droppable({children, id}: Readonly<{
  children: React.ReactNode;
  id: UniqueIdentifier
}>) {
  const {isOver, setNodeRef} = useDroppable({
    id
  });
  const style = {
    color: isOver ? 'red' : undefined,
    background: 'green' ,
    height: '100px'
  };

  
  
  return (
    <div ref={setNodeRef} style={style} className='flex flex-col gap-2 w-[100px]'>
        放到裡面{id}
      {children}
    </div>
  );
}