import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div>
      <Button onClick={() => props.count.value -= 1}>-1</Button>
      <span>&nbsp;{props.count}&nbsp;</span>
      <Button onClick={() => props.count.value += 1}>+1</Button>
    </div>
  );
}
