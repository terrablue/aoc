import {readFileSync} from "fs";

const contained = (one, other) => one[0] >= other[0] && one[1] <= other[1];
const overlap = (one, other) => one[0] >= other[0] && one[0] <= other[1];

const calc = algo => readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .filter(pair => pair != "")
  .map(pair => pair
    .split(",")
    .map(assignment => assignment.split("-")
      .map(section => Number(section))))
  .filter(([left, right]) => algo(left, right) || algo(right, left))
  .length
;

console.log("part 1", calc(contained));
console.log("part 2", calc(overlap));

