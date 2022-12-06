import {readFileSync} from "fs";

const signals = [...readFileSync("real.input", {encoding: "utf-8"})];
const findMarkerPosition = distinct =>
  signals.findIndex((_, i, signals) =>
    new Set(signals.slice(i-distinct, i)).size === distinct);

console.log("part 1", findMarkerPosition(4));
console.log("part 2", findMarkerPosition(14));
