import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { IImage } from "./types";

import { createContext, useContextSelector } from "use-context-selector";

const ImageStaticContext = createContext<IImage[]>([]);

const ImageDynamicContext = createContext<
  Dispatch<SetStateAction<IImage[]>> | undefined
>(undefined);

export function useImageStateSelector(): IImage[] {
  const images = useContextSelector(ImageStaticContext, (value) => value);
  if (typeof open === "undefined") {
    throw new Error(
      "useImageStateSelector must be used within a ImageStaticContext"
    );
  }
  return images;
}

export function useImageSetStateSelector(): Dispatch<SetStateAction<IImage[]>> {
  const setImages = useContextSelector(ImageDynamicContext, (value) => value);
  if (typeof setImages === "undefined") {
    throw new Error(
      "useImageSetStateSelector must be used within an ImageDynamicContext"
    );
  }
  return setImages;
}

export default function ImageProvider({ children }: { children: ReactNode }) {
  const state = useState<IImage[]>([]);
  return (
    <ImageStaticContext.Provider value={state[0]}>
      <ImageDynamicContext.Provider value={state[1]}>
        {children}
      </ImageDynamicContext.Provider>
    </ImageStaticContext.Provider>
  );
}
