import {readFileSync} from "fs";

const n = Symbol("n");
const tokens = {
  "[": ({stack, ...rest}) => {
    let ref = [];
    stack.at(-1)?.push(ref);
    return {stack: [...stack, ref], ...rest};
  },
  "]": ({stack}) => ({stack: stack.slice(0, -1), result: stack.at(-1)}),
  ",": _ => _, // noop
  [n]: ({stack, ...rest}, item) => {
    stack.at(-1).push({a: 10}[item] ?? +item);
    return ({stack, ...rest});
  }
};

const parse = packet => [...packet].reduce(({stack, result}, item) =>
  tokens[tokens[item] ? item : n]({stack, result}, item), {stack: []});

const pairs = readFileSync("real.input", {encoding: "utf-8"})
    .replaceAll("10", "a") /* easier for parsing, can ignore , */
    .split("\n\n").map(e => e.split("\n").map(s => parse(s).result));

const compare = (left, right) => {
  // if both values are lists
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.reduce((equals, _, i) => {
      if (equals !== undefined) {
        return equals;
      }

      if (right[i] === undefined) {
        return false;
      }
      const result = compare(left[i], right[i]);
      return result === undefined ? equals : result;
    }, undefined) ?? (left.length < right.length ? true : undefined);
  }
  if (typeof left === "number" && typeof right === "number") {
    return left === right ? undefined : left < right;
  }
  if (Array.isArray(left)) {
    return compare(left, [right]) ?? undefined;
  }
  if (Array.isArray(right)) {
    return compare([left], right) ?? undefined;
  }
};

const sum = pairs
  .map(([left, right], i) => [compare(left, right), i+1])
  .filter(([result]) => result)
  .reduce((a, [, b]) => a + b, 0);

const d2 = [[2]];
const d6 = [[6]];
const set = [...pairs.reduce((set, pair) => [...set, ...pair]), d2, d6]
  .sort((a, b) => compare(a, b) ? -1 : 1)

const find = (set, a) => set.findIndex(e => e === a);

console.log("part 1", sum);
console.log("part 2", (find(set, d2)+1)*(find(set, d6)+1));
