import {readFileSync} from "fs";

const movements = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(s => s.split(" "))
  .flatMap(([letter, length]) => Array.from({length}, () => letter))

const directions = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

const subtractV = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];
const addV = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];

const next = (delta, position) =>
  Math.abs(delta) < 3 ? position + Math.sign(delta) : position;

const follow = (delta, position) =>
  Array.from({length: 2}, (_, i) => next(delta[i], position[i]));

const update = (m, n) => {
  const s = subtractV(m, n);
  return Math.abs(s[0]) === 2 || Math.abs(s[1]) === 2 ? follow(s, n) : n;
};

const start = (length, movements) =>
  new Set(movements.reduce((snakes, direction) => {
    const [head, ...body] = snakes.at(-1);
    return [...snakes, body.reduce((parts, part, i) =>
      [...parts, update(parts[i], part)], [addV(head, directions[direction])])];
  }, [Array.from({length: length + 1}, () => [0, 0])])
    .map(snakes => snakes.at(-1).join(":")))
    .size;

console.log("part 1", start(1, movements));
console.log("part 2", start(9, movements));
