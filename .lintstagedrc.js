/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-05 17:42:27
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-05 20:00:31
 */
const { ESLint } = require("eslint");
const micromatch = require('micromatch');
const cli = new ESLint({});

const eslint = async (files) =>
  "npx eslint --fix --max-warnings=0 " +
  (await Promise.all(files.filter(async (file) => !await cli.isPathIgnored(file)))).join(" ");
const stylelint = (files) => `npx stylelint --fix ${files.join(" ")}`;
const prettier = (files) => `npx prettier --write ${files.join(" ")}`;

function rules(...args) {
  return async (files) => files?.length ? await Promise.all(args.map(async (f) => await f(files))) : await Promise.all([]);
}

module.exports = async (files) => {
  const vueLint = await (rules(eslint, stylelint, prettier)(micromatch(files, ["**/*.vue"])));
  const jsLint = await (rules(eslint, prettier)(micromatch(files, ["**/*.js"])));
  const scssLint = await (rules(stylelint, prettier)(micromatch(files, ["**/*.scss"])));
  const docLint = await (rules(prettier)(micromatch(files, ["**/*.{html,yml,json,md}"])))
  const linters = [...vueLint, ...jsLint, ...scssLint, ...docLint]
  return linters
}