import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { REST_API } from "../constants";

import { IImage } from "../types";

interface Props {
  thumbnailClassName?: string;
  mainClassName?: string;
  image: IImage;
}

export default function Image({
  image: { blurHash, height, id, url, width },
  mainClassName,
  thumbnailClassName,
}: Props) {
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadStarted, setLoadStarted] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleLoadStarted = () => {
    setLoadStarted(true);
  };
  return (
    <>
      <LazyLoadImage
        key={id}
        width={width}
        height={height}
        alt={id}
        src={`${REST_API}/${url}`}
        onLoad={handleLoad}
        beforeLoad={handleLoadStarted}
        className={mainClassName}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {!isLoaded && isLoadStarted && (
        <Blurhash
          hash={blurHash}
          className={thumbnailClassName}
          resolutionX={32}
          resolutionY={32}
          punch={1}
          width="100%"
          height="100%"
        />
      )}
    </>
  );
}
