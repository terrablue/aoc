import {readFileSync} from "fs";

const program = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(s => s.split(" "))

const instructions = {
  noop: () => [0],
  addx: v => [0, +v],
};

const addV = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];

const cycles = program.reduce((cycles, [type, value]) =>
  [...cycles, ...instructions[type](value).map(v1 => [v1, 1])], [[1, 0]]);

const total = (...jumps) => jumps.map(n =>
  n * cycles.slice(0, n).reduce((sum, n) => sum + n[0], 0))
  .reduce((sum, n) => sum + n);

const screen = {
  height: 6,
  width: 40,
};

const valueAt = (cycles, length) =>
  Array.from({length}, _ => _).reduce((sum, _, i) => sum + cycles[i][0], 0);

const draw = ({height, width}) => Array.from({length: height},
  (_, x) => Array.from({length: width}, 
  (_, y) => [x, y+1]).map(([x, y]) =>
    Math.abs(valueAt(cycles, x * width + y) + 1 - y) <= 1 ? "#" : "."))
  .map(line => line.join(""))
  .join("\n")

console.log("part 1", total(20, 60, 100, 140, 180, 220));
console.log("part 2");
console.log(draw(screen));
