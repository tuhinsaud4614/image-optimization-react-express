import Backdrop from "./Backdrop";
import classes from "./Modal.module.css";
import Portal from "./Portal";

interface Props {
  onHide?(): void;
  open: boolean;
  children?: React.ReactNode;
}

export default function Modal({ onHide, open = false, children }: Props) {
  return (
    <Portal>
      {open && <Backdrop onHide={onHide} />}

      {open && (
        <div role="dialog" className={classes?.Modal}>
          {children}
        </div>
      )}
    </Portal>
  );
}
