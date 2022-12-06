import {readFileSync} from "fs";

const data = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .filter(rucksack => rucksack != "");

const commons = data
  .map(rucksack => {
    const half = rucksack.length / 2;
    return [rucksack.slice(0, half), rucksack.slice(half)];
  })
  .reduce((commons, [left, right]) =>
    [...commons, left.split("").find(character => right.includes(character))]
  , []);

const badges = data
  .reduce((groups, _, i, rucksacks) =>
    i % 3 === 0
      ? [...groups, rucksacks.slice(i, i+3)]
      : groups
  , [])
  .reduce((badges, [left, middle, right]) =>
    [...badges, left.split("").find(character =>
      middle.includes(character) && right.includes(character))]
  , []);

const sum = chars => chars
  .map(common => common.charCodeAt())
  .map(value => value > 90 ? value - 96 : value - 38)
  .reduce((sum, n) => sum + n);

console.log("part 1", sum(commons));
console.log("part 2", sum(badges));
