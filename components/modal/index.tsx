'use client';

import { useImperativeHandle, useRef, Ref, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from "react-dom";

export default function Modal({ children, ref }: { children: React.ReactNode, ref: Ref<unknown> }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));


  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="modal-backdrop">

      <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
        {children}
        <button onClick={onDismiss} className="close-button">X</button>
      </dialog></div>,
      document.body
    
  );
}
