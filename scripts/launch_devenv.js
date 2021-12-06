var fs = require('fs');
var process = require('process');
var child_process = require('child_process');
var Path = require("path")
var { env } = require("./env.js")
var package = require("../package.json")

// Find project
var ewam_kernel_path =package.dependencies["@ewam/kernel"]
const project_path = Path.resolve(ewam_kernel_path, `../../.build-2019-x64/WIDE.sln`)
if (!fs.existsSync(project_path)) {
  console.error("Cannot open VS project, expected at: " + project_path)
  process.exit(1)
}

// Find visual studio
let VSDevenvExe = [
  `C:/Program Files (x86)/Microsoft Visual Studio/2019/Professional/Common7/IDE/devenv.exe`,
  `C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/Common7/IDE/devenv.exe`,
  `D:/Program Files (x86)/Microsoft Visual Studio/2019/Professional/Common7/IDE/devenv.exe`,
  `D:/Program Files (x86)/Microsoft Visual Studio/2019/Community/Common7/IDE/devenv.exe`,
].find(x => fs.existsSync(x))
if (!VSDevenvExe) {
  console.error("Cannot found VS devenv.exe")
  process.exit(1)
}

console.log("Open VS project at:", project_path)
child_process.spawn(
  VSDevenvExe,
  [
    project_path
  ],
  {
    env,
    detached: true,
    stdio: [process.stdin, process.stdout, process.stderr],
  }
);
process.exit(0)
