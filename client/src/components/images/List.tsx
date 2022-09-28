import { useEffect } from "react";
import { REST_API } from "../../constants";
import { useImageSetStateSelector, useImageStateSelector } from "../../context";
import { useFetch } from "../../hooks";
import { IImage } from "../../types";
import Item from "./Item";
import classes from "./List.module.css";

export default function List() {
  const setImages = useImageSetStateSelector();
  const images = useImageStateSelector();
  const { loading, data, error } = useFetch<{ images: IImage[] }>(
    `${REST_API}/images`
  );

  useEffect(() => {
    if (loading === "fetched" && data?.images) {
      setImages(data.images);
    }
  }, [data, loading]);

  if (loading === "initial") {
    return null;
  }

  if (loading === "loading") {
    return <p style={{ color: "orange" }}>Loading...</p>;
  }

  if (loading === "error" && error) {
    return <p style={{ color: "red" }}>Image fetching failed!</p>;
  }

  if (images.length === 0) {
    return <p style={{ color: "red" }}>Images not found</p>;
  }

  return (
    <div className={classes.Root}>
      <table className={classes.Table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <Item key={image.id} image={image} index={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
