import { useState } from "react";

import { IImage } from "../../types";
import Image from "../Image";
import Modal from "../Modal";
import classes from "./List.module.css";

interface Props {
  image: IImage;
}

export default function ViewButton({ image }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Details
      </button>
      <Modal open={open} onHide={() => setOpen(false)}>
        <div style={{ position: "relative" }}>
          <Image
            image={image}
            mainClassName={classes.PreviewImage}
            thumbnailClassName={classes.BlurImage}
          />
        </div>
      </Modal>
    </>
  );
}
