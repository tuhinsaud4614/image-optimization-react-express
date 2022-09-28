import { IImage } from "../../types";
import Image from "../Image";
import classes from "./List.module.css";
import ViewButton from "./ViewButton";

interface Props {
  image: IImage;
  index: number;
}

export default function Item({ image, index }: Props) {
  return (
    <>
      <tr>
        <th>{index}</th>
        <td>
          <div className={`${classes.ImgRoot} ${classes.SpaceX3}`}>
            <div className={classes.Avatar}>
              <div className={classes.AvatarWrap}>
                <Image
                  image={image}
                  mainClassName={classes.Img}
                  thumbnailClassName={classes.BlurImage}
                />
              </div>
            </div>
            <div className={classes.SpaceX3}>
              <div className={classes.Title}>{image.id}</div>
            </div>
          </div>
        </td>
        <th>
          <ViewButton image={image} />
        </th>
      </tr>
    </>
  );
}
