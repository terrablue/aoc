import {readFileSync} from "fs";

const cubes = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(line => line.split(",").map(Number));

const box = cubes
  .reduce(([min, max], [x, y, z]) => [
    [x < min[0] ? x : min[0], y < min[1] ? y : min[1], z < min[2] ? z : min[2]],
    [x > max[0] ? x : max[0], y > max[1] ? y : max[1], z > max[2] ? z : max[2]]
], [[Infinity, Infinity, Infinity], [0, 0, 0]])
  .map((bound, i) => bound.map(b => b + (i === 0 ? -1 : 1)));

const neighbors = ([x, y, z]) => [
  [x+1, y, z],
  [x-1, y, z],
  [x, y+1, z],
  [x, y-1, z],
  [x, y, z+1],
  [x, y, z-1],
];

const meets = ([x, y, z], others) => others.some(([o1, o2, o3]) => 
  o1 === x && o2 === y && o3 === z);

const inbounds = ([x, y, z], [mins, maxs]) =>
  x >= mins[0] && x <= maxs[0] &&
  y >= mins[1] && y <= maxs[1] &&
  z >= mins[2] && z <= maxs[2];

const part1 = cubes =>
  cubes.reduce((sum, cube) => sum + 
    neighbors(cube).filter(neighbor => !meets(neighbor, cubes)).length, 0);

const part2 = (cubes, box) => {
  const unvisited = [box[0]];
  const visited = [];

  let water = 0;
  while (unvisited.length > 0) {
    const current = unvisited.shift();
    if (!meets(current, visited)) {
      neighbors(current)
        .filter(c => inbounds(c, box))
        .forEach(neighbor => {
          if (meets(neighbor, cubes)) {
            water++;
          } else {
            unvisited.unshift(neighbor);
          }
        });
      visited.push(current);
    }
  }
  return water;
};

console.log(part1(cubes));
console.log(part2(cubes, box));
