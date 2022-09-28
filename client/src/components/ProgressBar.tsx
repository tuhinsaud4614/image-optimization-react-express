import { forwardRef, Ref } from "react";

interface Props {
  value: number;
}

function Root({ value }: Props, ref?: Ref<HTMLDivElement>) {
  return (
    <div
      style={{ border: "1px solid red", borderRadius: 24, overflow: "hidden" }}
    >
      <div
        ref={ref}
        style={{ height: "16px", width: `${value}%`, background: "orange" }}
      />
    </div>
  );
}

const ProgressBar = forwardRef(Root);
export default ProgressBar;
