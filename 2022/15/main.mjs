import {readFileSync} from "fs";

const RE = {
  sensor: /^Sensor at x=(-?\d*), y=(-?\d*)$/g,
  beacon: /^closest beacon is at x=(-?\d*), y=(-?\d*)$/g,
};

const v = v0 => ({
  distance: v1 => Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]),
  equals: v1 => v0[0] === v1[0] && v0[1] === v1[1],
});

const sensors = readFileSync("real.input", {encoding: "utf-8"})
  .split("\n")
  .slice(0, -1)
  .map(line => line.split(":"))
  .map(([sensor, beacon]) => [
    [...sensor.matchAll(RE.sensor)].flat().slice(1).map(n => Number(n)),
    [...beacon.trim().matchAll(RE.beacon)].flat().slice(1).map(n => Number(n)),
  ])
  .map(([[x, y], beacon]) => 
    ({x, y, beacon, distance: v([x, y]).distance(beacon)}))
  .map(({x, y, beacon, distance}) => ({
    x, y, beacon, distance,
    left: x - distance, right: x + distance,
    top: y - distance, bottom: y + distance,
  }));

const canBeacon = (sensors, coordinate) =>
  sensors.every(({x, y, distance, beacon}) =>
    coordinate.equals(beacon) || coordinate.distance([x, y]) > distance);

const hasBeaconWithin = (sensors, x, y, from, to) =>
  x >= from && y >= from && x <= to && y <= to && canBeacon(sensors, v([x, y]));

const impossibleInRow = (sensors, [left, right], row) =>
  Array.from({length: right - left}, (_, i) => left + i)
    .filter(x => !canBeacon(sensors, v([x, row]))).length;

const around = ({x: sx, y: sy, top, bottom, left, right}, size) => {
  // top to right
  for (let y = top-1, x = sx; x <= right+1 && y <= sy; x++, y++) {
    if (hasBeaconWithin(sensors, x, y, 0, size)) {
      return [x, y];
    }
  }
  // right to bottom
  for (let x = right+1, y = sy; x >= sx && y <= bottom+1; x--, y++) {
    if (hasBeaconWithin(sensors, x, y, 0, size)) {
      return [x, y];
    }
  }
  // bottom to left
  for (let x = sx, y = bottom+1; x >= left+1 && y >= sy; x--, y--) {
    if (hasBeaconWithin(sensors, x, y, 0, size)) {
      return [x, y];
    }
  }
  // left to top
  for (let x = left+1, y = sy; x <= sx && y >= top+1; x++, y--) {
    if (hasBeaconWithin(sensors, x, y, 0, size)) {
      return [x, y];
    }
  }
}

const xbounds = sensors =>
  sensors.reduce(([maxleft, maxright], {left, right}) =>
    [left < maxleft ? left : maxleft, right > maxright ? right : maxright],
  [0, 0]);

console.log("part 1", impossibleInRow(sensors, xbounds(sensors), 2_000_000));
const size = 4_000_000;
const [x, y] = sensors.map(sensor => around(sensor, size)).find(v => v);
console.log("part 2", x * size + y);
