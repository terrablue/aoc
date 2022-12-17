import {readFileSync} from "fs";

const jets = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)[0];

const v = v0 => ({
  equals: v1 => v0[0] === v1[0] && v0[1] === v1[1],
  add: v1 => [v0[0] + v1[0], v0[1] + v1[1]],
});

const getSide = (rock, offset) =>
  rock.filter(block => !rock.some(b => v(v(block).add(offset)).equals(b)));

const top = rock => rock.reduce((top, [, y]) => y < top ? y : top, 0);
const left = rock => rock.reduce((left, [x]) => x < left ? x : left, Infinity);
const right = rock => rock.reduce((right, [x]) => x > right ? x : right, 0);

const maptop = game => game
  .map(rock => top(rock))
  .reduce((top, rocktop) => rocktop < top ? rocktop : top, 0);

const hits = (rock, game, offset) =>
  game.filter(r => r !== rock).some(other => 
    getSide(rock, offset).some(block => other.some(b =>
      v(v(block).add(offset)).equals(b))));

const move = (rock, position, offset) => {
  for (const block of rock) {
    block[position] += offset;
  }
}

const moveJet = (rock, game, jet, length) => {
  if (jet === ">") {
    if (right(rock) < length - 1 && !hits(rock, game, [1, 0])) {
      move(rock, 0, 1);
    }
  } else {
    if (left(rock) > 0 && !hits(rock, game, [-1, 0])) {
      move(rock, 0, -1);
    }
  }
}

const hasPattern = (sub, differences, steps) => {
  let one;
  let two;
  for (let i = 0; i < differences.length; i++) {
    let local = true
    for (let j = 0; j < sub.length; j++) {
      if (differences[i + j] !== sub[j]) {
        local = false;
        break;
      }
    } 
    if (local) {
      if (one === undefined) {
        one = i;
      } else 
        if (two === undefined) {
        two = i;
      }
    }
  }
  // "proper" cycle detection is guaranteed by repetition
  if (one !== undefined && two !== undefined && two - one === sub.length) {
    const before = differences.slice(0, one).reduce((a, b) => a + b, 0);
    const sum = sub.reduce((a, b) => a + b);
    const remainder = (steps - one) % sub.length;
    const times = Math.trunc((steps - one) / sub.length);
    const after = sub.slice(0, remainder).reduce((a, b) => a + b, 0);
    return before + times * sum + after;
  }
};

const findPattern = (outcomes, steps) => {
  const differences = outcomes.map(([, y]) => y);
  for (let x = differences.length - 1; x >= 0; x--) {
    const sub = differences.slice(-x);
    // "proper" cycle detection is guaranteed by length
    if (sub.length > 10) {
      const pattern = hasPattern(sub, differences, steps); 
      if (pattern !== undefined) {
        return pattern;
      }
    }
  }
};

const play = ({rounds, rocks, jets, length}) => {
  const outcomes = [];
  const floor = Array.from({length}, (_, i) => [i, 0]);
  floor.done = true;
  let current = floor;
  const game = [current];
  let rockAt = 0;
  let jetAt = 0;
  const leftStart = 2;

  const rockBottoms = rocks.map(rock =>
    rock.reduce((bottom, [, y]) => y > bottom ? y : bottom, 0));

  while (true) {
    if (current?.done) {
      const rock = [...rocks[rockAt]];

      // spawn new rock two units away from left wall and three units higher than
      // bottom
      const bottomStart = maptop(game) - rockBottoms[rockAt] - 4;
      rockAt = (rockAt + 1) % rocks.length;

      current = rock.map(block => v([leftStart, bottomStart]).add(block));

      game.push(current);
    } else {
      moveJet(current, game, jets[jetAt], length);
      jetAt = (jetAt + 1) % (jets.length);
      if (hits(current, game, [0, 1])) {
        current.done = true;
        const outcome = maptop(game);
        outcomes.push([outcome, (outcomes?.at(-1)?.[0] ?? 0) - outcome]);

        const result = findPattern(outcomes, rounds);
        if (result) {
          return result;
          break;
        }
        continue;
      } else {
        move(current, 1, 1);
      }
    }
  }
}

const config = {jets, length: 7, rocks: [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[1, -2], [0, -1], [1, -1], [2, -1], [1, 0]],
  [[2, -2], [2, -1], [0, 0], [1, 0], [2, 0]],
  [[0, -3], [0, -2], [0, -1], [0, 0]],
  [[0, -1], [1, -1], [0, 0], [1, 0]],
]};

console.log("part 1", play({...config, rounds: 2_022}));
console.log("part 2", play({...config, rounds: 1_000_000 ** 2}));
