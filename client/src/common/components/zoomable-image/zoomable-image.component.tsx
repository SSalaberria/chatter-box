/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { createPortal } from "react-dom";

import css from "./zoomable-image.module.css";

export function ZoomableImage(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        {...props}
        loading="lazy"
        style={{
          ...props?.style,
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)}
      />
      {isOpen &&
        createPortal(
          <dialog
            open
            className={
              "absolute inset-0 flex h-screen w-screen items-center justify-center bg-[#00000090] p-10"
            }
            onClick={() => setIsOpen(false)}
          >
            <img className={css.anim} src={props.src} />
          </dialog>,
          document.body,
        )}
    </>
  );
}
