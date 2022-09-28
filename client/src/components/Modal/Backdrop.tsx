import classes from "./Modal.module.css";

interface Props {
  onHide?(): void;
}

export default function Backdrop({ onHide }: Props) {
  return <div className={classes.Backdrop} onClick={onHide} />;
}
