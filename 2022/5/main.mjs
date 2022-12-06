import {readFileSync} from "fs";

const [stackLines, moveLines] = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n\n")
  .map(strs => strs.split("\n"));

// length is normalized, can go by first
const length = Math.trunc(stackLines[0].length / 3);

const stacks = stackLines.slice(0, -1)
  .map(stack => Array.from({length}, (_, i) => stack[i+i*3+1]))
  .reduce((stacks, line) =>
    stacks.map((stack, i) =>
      line[i] !== ' ' ? [line[i], ...stack] : stack)
  , Array.from({length}, () => []));

const regex = /^move (\d*) from (\d*) to (\d*)$/g;

const moves = moveLines
  .filter(line => line !== "")
  .map(move => [...move.matchAll(regex)])
  .map(([move]) => move.slice(1, 4));

const reversed = array => array.map((n, i, orig) => orig[orig.length-i-1]);

const move = (stacks, f_i, t_i, count, fn) => {
  const from = stacks[f_i];
  return {
    [f_i]: from.slice(0, -count),
    [t_i]: [...stacks[t_i], ...fn(from.slice(-count))],
  }
}

const calc = fn => moves
  .reduce((stacks, [count, f_i, t_i]) =>
    stacks.map((stack, i) => move(stacks, f_i-1, t_i-1, count, fn)[i] ?? stack)
  , stacks)
  .map(move => move.at(-1))
  .join("");

console.log("part 1", calc(reversed));
console.log("part 2", calc(a => a));
