import {readFileSync} from "fs";

const RE = {
  ore: /^Each ore robot costs (\d*) ore$/g,
  clay: /^Each clay robot costs (\d*) ore/g,
  obsidian: /^Each obsidian robot costs (\d*) ore and (\d*) clay$/g,
  geode: /^Each geode robot costs (\d*) ore and (\d*) obsidian/g,
};
const ROBOTS = ["ore", "clay", "obsidian", "geode"];
const resources = Object.fromEntries(ROBOTS.map(name => [name, 0]));

const blueprints = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(blueprint => 
    blueprint.split(":")[1].slice(1).split(".").slice(0, -1).map(robot =>
      robot.trim()))
  .map(([ore, clay, obsidian, geode]) => ({
    ore: +[...ore.matchAll(RE.ore)][0][1],
    clay: +[...clay.matchAll(RE.clay)][0][1],
    obsidian: [...obsidian.matchAll(RE.obsidian)][0].slice(1, 3).map(Number),
    geode: [...geode.matchAll(RE.geode)][0].slice(1, 3).map(Number),
  }))
  .map(({ore, clay, obsidian, geode}) => ({
    ore: {...resources, ore},
    clay: {...resources, ore: clay},
    obsidian: {...resources, ore: obsidian[0], clay: obsidian[1]},
    geode: {...resources, ore: geode[0], obsidian: geode[1]},
  }));

const State = class {
  constructor({resources, blueprint, robots, minutes}) {
    this.resources = resources;
    this.blueprint = blueprint;
    this.robots = robots;
    this.minutes = minutes;
  }

  construct(robot) {
    const {resources, robots, blueprint, minutes} = this;
    return {
      ...this.idle(),
      resources: Object.fromEntries(ROBOTS.map(name => 
          [name, resources[name] - blueprint[robot][name] + robots[name]])),
      robots: {...robots, [robot]: robots[robot] + 1},
    };
  }

  idle() {
    const {resources, robots, blueprint, minutes} = this;
    return {
      robots, blueprint, minutes: minutes - 1,
      resources: Object.fromEntries(ROBOTS.map(name =>
        [name, resources[name] + robots[name]])),
    };
  }

  constructible(robot) {
    const {resources, blueprint} = this;
    return ROBOTS.slice(0, 3).map(name =>
       resources[name] - blueprint[robot][name]).every(cost => cost >= 0);
  };

  next() {
    return [new State(this.idle())].concat(ROBOTS
      .filter(robot => this.constructible(robot))
      .map(robot => new State({...this.construct(robot)})));
  }

  assess() {
    const {resources, robots, minutes} = this;
    return (resources.geode + minutes * robots.geode) * 10 ** 3 +
      robots.obsidian * 10 ** 2 +
      robots.clay * 10 +
      robots.ore;
  }
};

const start = (minutes, config) => {
  let states = [new State({...config, minutes})];
  for (let minute = minutes; minute > 0; minute--) {
    const next = [];
    for (const state of states) {
      next.push(...state.next());
    }
    states = next.sort((a, b) => b.assess() - a.assess()).slice(0, 10000);
  }

  return states
    .sort((a, b) => b.resources.geode - a.resources.geode)[0].resources.geode;
}

const part1 = (config, blueprints) => blueprints.reduce((sum, blueprint, i) =>
    sum + start(24, {...config, blueprint}) * (i + 1), 0);
const part2 = (config, blueprints) => blueprints.reduce((sum, blueprint, i) =>
    sum * start(32, {...config, blueprint}), 1);

const robots = {ore: 1, clay: 0, obsidian: 0, geode: 0};
console.log("part 1", part1({resources, robots}, blueprints));
console.log("part 2", part2({resources, robots}, blueprints.slice(0, 3)));
