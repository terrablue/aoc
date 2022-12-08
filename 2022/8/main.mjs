import {readFileSync} from "fs";

const trees = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .map(line => line.split("").map(Number))
  .slice(0, -1);

const matrixSlice = (matrix, startx, starty, endx, endy) =>
  matrix.slice(startx, endx).reduce((accu, line) =>
    [...accu, line.slice(starty, endy)], []);

const reversed = array => array.map((n, i, orig) => orig[orig.length - i - 1]);

const map = ([trees, height], projection, transformation = x => x) =>
  transformation(matrixSlice(trees, ...projection).flat())
    .findIndex(tree => tree >= height);

const up = (data, x, y) => map(data, [0, y, x, y + 1], reversed);
const right = (data, x, y) => map(data, [x, y + 1, x + 1, data[0].length]);
const down = (data, x, y) => map(data, [x + 1, y, data[0].length, y + 1]);
const left = (data, x, y) => map(data, [x, 0, x + 1, y], reversed);

const toEdge = [
  /* up */    (x, y, length) => x,
  /* right */ (x, y, length) => length - 1 - y,
  /* down */  (x, y, length) => length - 1 - x,
  /* left */  (x, y, length) => y,
];

const [part1, part2] = trees.reduce(([visible, max], row, x) => {
  const [v1, m1] = row.reduce(([v2, m2], tree, y, {length}) => {
    const results = [up, right, down, left].map(fn => fn([trees, tree], x, y));
    const scenics = results
      .map((result, i) => result !== -1 ? result + 1 : toEdge[i](x, y, length))
      .reduce((view, n) => view * n);
    return [v2 + +results.some(r => r === -1), m2 < scenics ? scenics : m2];
  }, [0, 0]);
  return [visible + v1, max < m1 ? m1 : max];
}, [0, 0]);

console.log("part 1", part1);
console.log("part 2", part2);
