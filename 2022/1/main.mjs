import fs from "fs";

const input = fs.readFileSync("real.input", {encoding: "utf-8"});

const elves = input.split("\n").reduce((accu, e) => {
  // new elf
  if (e === '') {
    accu.push([]);
  } else {
    accu[accu.length-1].push(Number(e));
  }
  return accu;
}, [[]]).map(elf => elf.reduce((sum, n) => sum + n, 0));

console.log("part 1", Math.max(...elves));

elves.sort((a, b) => {
  if (a > b) {
    return 1;
  } else {
    return -1;
  }
});

const length = elves.length;

console.log("part 2", elves[length-1] + elves[length-2] + elves[length-3]);
