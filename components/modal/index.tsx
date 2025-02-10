'use client';

import { useImperativeHandle, useRef, Ref, useState,useEffect} from 'react';
import { createPortal } from "react-dom";
import { CloseButton } from '../ui/close-button';

export default function Modal({ children, ref, onCancel }: { children: React.ReactNode, ref: Ref<unknown>, onCancel: ()=>void }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

    const [container, setContainer] = useState<HTMLElement | null>(null);
  
    useEffect(() => {
      console.log('container', document.getElementById("modal-root"))
      setContainer(document.getElementById("modal-root"));
    }, []);

  return (container && createPortal(
    <div className="modal-backdrop">

      <dialog ref={dialogRef} className="modal relative" onClose={onCancel}>
        {children}
        <CloseButton onClick={onCancel} className='absolute top-1 right-1'/>
      </dialog></div>,
      container as HTMLElement
    
  ));
}
