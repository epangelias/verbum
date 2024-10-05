import { useSignal } from "@preact/signals";
import { define } from "../lib/utils.ts";
import Counter from "../islands/Counter.tsx";
import { Spatium } from "../islands/Spatium.tsx";

export default define.page(function Home() {
  return <Spatium />;
});
