import {readFileSync} from "fs";

const v = v0 => ({
  equals: v1 => v0[0] === v1[0] && v0[1] === v1[1],
  add: v1 => [v0[0] + v1[0], v0[1] + v1[1]],
});

const map = {
  grid: readFileSync("real.input", {encoding: "utf-8"})
    .split("\n")
    .slice(0, -1).map(line => line.split("")),
  at: function([x, y]) { 
    const symbol = this.grid[x]?.[y]; /* ?. covers out of map coordinates */
    return {S: "a", E: "z"}[symbol] ?? symbol;
  },
  find: function(symbol) {
    const x = this.grid.findIndex(line => line.includes(symbol));
    return [x, this.grid[x].findIndex(character => character === symbol)];
  },
};

const elevation = v => map.at(v).charCodeAt() - 97;
const neighbors = from => [[-1, 0], [0, 1], [1, 0], [0, -1]]
  .map(direction => v(from).add(direction))
   // the right-hand side of && is reversed, as we're going down (from the end)
  .filter(delta => map.at(delta) && elevation(delta) - elevation(from) >= -1);

const bfs = (start, goal) => {
  const queue = [[start, 0]];
  const visited = [start];
  while (queue.length > 0) {
    const [current, steps] = queue.shift();
    if (v(current).equals(goal) || map.at(current) === goal) {
      return steps;
    }
    for (const neighbor of neighbors(current)) {
      if (!visited.find(node => v(node).equals(neighbor))) {
        visited.unshift(neighbor);
        queue.push([neighbor, steps + 1]);
      }
    }
  }
};

const end = map.find("E");
console.log("part 1", bfs(end, map.find("S")));
console.log("part 2", bfs(end, "a"));
