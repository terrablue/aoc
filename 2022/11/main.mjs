import {readFileSync} from "fs";

const input = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n\n")
  .map(monkey => monkey.split("\n").slice(1).map(l => l.trim().split(": ")[1]))

const operators = {
  ["*"]: n => old => old * (n ?? old),
  ["+"]: n => old => old + (n ?? old),
};

const toOperation  = str => {
  const [operator, operand] = str.slice(1);
  return operators[operator](Number.isNaN(+operand) ? null : +operand);
};

const Monkey = class {
  constructor(config) {
    const [starting, operation, test, ift, iff] = config;
    this.items = starting.split(", ").map(Number);
    this.operation = toOperation(operation.match(/^new = old (.) (.*)$/));
    this.divisibleBy = +test.match(/^divisible by (\d*)$/)[1];
    this.ift = +/(\d.*)/.exec(ift)[0];
    this.iff = +/(\d.*)/.exec(iff)[0];
    this.inspected = 0;
  }

  play(reduction = i => i) {
    const next = this.items.map(item => {
      const worry =  Math.floor(reduction(this.operation(item)));
      return [worry % this.divisibleBy === 0 ? this.ift : this.iff, worry];
    })
    this.inspected += this.items.length;
    this.items = [];
    return next;
  }
};

const sorted = (array, by)  => [...array].sort(by);

const by = (m1, m2) => m2.inspected > m1.inspected ? 1 : -1;

const start = (input, rounds, reduction) => {
  const monkeys = input.map(monkey => new Monkey(monkey));
  const deworry = monkeys.reduce((acc, {divisibleBy}) => acc * divisibleBy, 1);
  for (let i = 0; i < rounds; i++) {
    for (const monkey of monkeys) {
      for (const [i, worry] of monkey.play(reduction)) {
        monkeys[i].items.push(worry % deworry);
      }
    }
  }
  return sorted(monkeys, by).slice(0, 2).reduce((a, b) =>
    a.inspected * b.inspected);
}

console.log("part1", start(input, 20, i => i / 3));
console.log("part2", start(input, 10000));
