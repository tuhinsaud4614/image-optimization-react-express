import axios from "axios";
import { ChangeEvent, useId, useState } from "react";

import { REST_API } from "../constants";
import { useImageSetStateSelector } from "../context";
import classes from "./ImageUpload.module.css";
import ProgressBar from "./ProgressBar";

export default function ImageUpload() {
  const setImages = useImageSetStateSelector();

  const [value, setValue] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    if (!value) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", value);
      setLoading(true);
      setError("");

      const response = await axios.post(`${REST_API}/images/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(Math.round(percent));
        },
      });

      if (response.status !== 201) {
        setProgress(0);
        setLoading(false);
        setError("Image not uploaded!");
        return;
      }

      setValue(null);
      setProgress(0);
      setLoading(false);
      setImages((prev) => [...prev, response.data.image]);
    } catch (error) {
      setError("Image upload failed!");
    }
  };

  return (
    <div>
      <div className={classes.Root}>
        <div className={classes.FileSelect}>
          <input
            type="file"
            id={id}
            accept="image/*"
            hidden
            onChange={handleChange}
          />
          <label htmlFor={id} className={classes.Label}>
            Choose File
          </label>
          <span className={classes.Btn}>
            {value ? value.name : "No file chosen"}
          </span>
        </div>
        <button type="button" disabled={!value || loading} onClick={onSubmit}>
          {loading ? "Loading..." : "Upload"}
        </button>
      </div>
      {!!progress && <ProgressBar value={progress} />}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
