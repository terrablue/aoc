import {readFileSync} from "fs";

const lines = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .map(round => round.split(" "))
  .slice(0, -1);

const rock = 0;
const paper = 1;
const scissors = 2;
const lose = -1;
const draw = 0;
const win = +1; 

const shapes = {
  A: rock,
  B: paper,
  C: scissors,
  X: rock,
  Y: paper,
  Z: scissors,
};

const shapesToSign = {
  X: lose,
  Y: draw,
  Z: win
};

const mod = (a, m) => a > 0
  ? a % m
  : (a + Math.ceil(-(a / m)) * m) % m;
console.log(mod(-2, 1));
console.log(mod(-1, 1));
console.log(mod(0, 1));
console.log(mod(1, 1));

const roundScore1 = (opponent, me) => {
  const opponentPlayed = shapes[opponent];
  const mePlayed = shapes[me];
  return [3, 6, 0][mod(mePlayed - opponentPlayed, 3)] + mePlayed + 1;
};

const roundScore2 = (opponent, me) => {
  const opponentPlayed = shapes[opponent];
  const mePlayed = mod(opponentPlayed + shapesToSign[me], 3);
  return [3, 6, 0][mod(mePlayed - opponentPlayed, 3)] + mePlayed + 1;
};

const total = func => lines.reduce((score, [opponent, me]) =>
  score + func(opponent, me), 0);

console.log("part 1", total(roundScore1));
console.log("part 2", total(roundScore2));
