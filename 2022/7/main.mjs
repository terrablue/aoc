import {readFileSync} from "fs";

const commands = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .reduce((commands, line) => line.startsWith("$")
    ? [...commands, [line.slice(2)]]
    : [...commands.slice(0, -1), [...commands.at(-1), line]]
  , [])
  // makes parsing easier
  .slice(1);

const Node = class {
  #size = 0;
  #children = [];

  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
  }

  get size() {
    return this.#size + this.#children.reduce((sum, {size}) => sum + size, 0);
  }

  find(predicate) {
    return this.#children.find(predicate);
  }

  collect(predicate) {
    const all = this.#children.flatMap(child => child.collect(predicate));
    return [predicate(this) ? [this]: [], all].flat();
  }

  addChild(name) {
    this.#children.push(new Node(name, this));
    return this;
  }

  increaseSize(by) {
    this.#size += by;
    return this;
  }
};

const cd = command => command.slice(3) === ".."
  ? current => current.parent
  : current => current.find(({name}) => name === command.slice(3));

const ls = params => current =>
  params.reduce((current, param) =>
    param.slice(0, 3) === "dir"
      ? current.addChild(param.slice(4))
      : current.increaseSize(+param.split(" ")[0])
  , current);

// needed as ref
const tree = new Node("/");
commands.reduce((current, [command, ...params]) => 
  (command === "ls" ? ls(params) : cd(command))(current), tree);

console.log("part 1", tree
  .collect(({size}) => size <= 100_000)
  .reduce((sum, {size}) => sum + size, 0));

const available = 70_000_000;
const needed = 30_000_000;

console.log("part 2", tree
  .collect(({size}) => (available - tree.size + size) > needed)
  .map(({size}) => size)
  .sort((a, b) => a - b)[0]);
