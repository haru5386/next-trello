import { MouseSensor , TouchSensor } from '@dnd-kit/core';
import { MouseEvent, TouchEvent } from 'react';
const IGNORE_TAGS = ['BUTTON'];


// Block DnD event propagation if element have "data-no-dnd" attribute
const customHandleEvent = (element: HTMLElement | null)=> {
    let cur = element;

    while (cur) {
      if (IGNORE_TAGS.includes(cur.tagName) || cur.dataset.noDnd) {
        return false;
      }
      cur = cur.parentElement;
    }
  
    return true;
};

MouseSensor.activators = [
    {
      eventName: 'onMouseDown',
      handler: ({ nativeEvent: event }: MouseEvent) => customHandleEvent(event.target as HTMLElement),
    },
  ];
  
  TouchSensor.activators = [
    {
      eventName: 'onTouchStart',
      handler: ({ nativeEvent: event }: TouchEvent) => customHandleEvent(event.target as HTMLElement),
    },
  ];