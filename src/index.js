const R = require("ramda");
const fs = require("fs");

const readFileSync = (path) => fs.readFileSync(path, { encoding: "utf-8" });

const doMagic = R.pipe(
  R.replace(/.*\//, ""),
  R.replace(/\..*/, ""),
  R.concat("Date\t"),
  R.concat(R.__, "\n")
);

const readData = R.pipe(R.converge(R.concat, [doMagic, readFileSync]));

const splitByRow = () => R.split("\n");
const splitByColumn = () => R.split("\t");

R.pipe(
  R.map(
    R.pipe(
      readData,
      splitByRow(),
      R.map(R.pipe(splitByColumn(), R.view(R.lensIndex(1)))),
      R.converge(R.map, [R.pipe(R.head, R.objOf), R.tail])
    )
  ),
  R.transpose,
  R.map(R.mergeAll),
  console.log
)(["./input/btc.csv", "./input/eth.csv"]);
