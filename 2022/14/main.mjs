import {readFileSync} from "fs";

const S = 500;
// tuple-to-string
const ts = (x, y) => `${x}.${y}`;
// string-to-tuple
const st = s => s.split(".").map(Number);

const v = v0 => ({
  add: v1 => [v0[0] + v1[0], v0[1] + v1[1]],
  equals: v1 => v0[0] === v1[0] && v0[1] === v1[1],
});

const rocks = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(line => line.split("->")
  .map(e => e.trim().split(",")).map(([a, b]) => [+b, +a]))
  .reduce((rocks, formation) => {
    for (let i = 0; i < formation.length-1; i++) {
      const [left, right] = [formation[i], formation[i+1]];

      const larger0 = left[0] > right[0] ? left : right;
      const smaller0 = left[0] > right[0] ? right : left;
      for (let j = larger0[0]; j >= smaller0[0]; j--) {
        rocks.add(ts(j, larger0[1]));
      }

      const larger1 = left[1] > right[1] ? left : right;
      const smaller1 = left[1] > right[1] ? right : left;
      for (let j = larger1[1]; j >= smaller1[1]; j--) {
        rocks.add(ts(larger1[0], j));
      }
    }
    return rocks;
}, new Set());

const at = (dust, set) => set.some(element => v(dust).equals(element));
const bottom = rocks => rocks.reduce((min, [x]) => x > min ? x : min, 0);
const left = rocks => rocks.reduce((left, [, y]) => y < left ? y : left, S);
const right = rocks => rocks.reduce((right, [, y]) => y > right ? y : right, S);

const part1 = (start, rocks) => {
  const sands = [];
  const movements = [/* down */0, /* left */-1, /* right */1];
  let current = [...start];
  let hit = 0;

  while (current[0] !== bottom(rocks)) {
    let moved = false;
    for (const movement of movements) {
      const delta = v(current).add([1, movement]);
      if (!at(delta, sands) && !at(delta, rocks)) {
        moved = true;
        current = delta;
        break;
      }
    }
    hit += !moved;
    if (hit === 2) {
      hit = 0;
      sands.push(current);
      current = [...start];
    }
  }

  return sands.length;
};

const addRocks = (rocks, min) => {
  let length = 0;
  while (true) {
    for (const [x, y] of rocks.filter(([x]) => x < min+1)) {
      // if left and right are rocks, and no rock beneath, add rock beneath
      if (at([x, y+1], rocks) && at([x, y-1], rocks) && !at([x+1, y], rocks)) {
        rocks.push([x+1, y]);
      }
    }
    if (length === rocks.length) {
      break;
    }
    length = rocks.length;
  }
}

const part2 = rocks => {
  const min = bottom(rocks);
  const rightMost = right(rocks);
  let added = 0;
  // artificially add floor
  for (let j = left(rocks) - min; j <= rightMost + min; j++) {
    rocks.push([min + 2, j]);
    added++;
  }
  addRocks(rocks, min);
  return bottom(rocks) ** 2 - (rocks.length - added); 
}

console.log("part 1", part1([0, S], [...rocks].map(st)));
console.log("part 2", part2([...rocks].map(st)));
