#!/usr/bin/env node
var process = require('process');
var child_process = require('child_process');
var { env } = require("./env.js")

const command = process.argv[2]
var myArgs = process.argv.slice(3);

if (command.toLowerCase() == 'wyseman.exe') {
  if (!process.env.PORT)
    console.log("env var 'PORT' is not defined. Taking 9945 as default")
  myArgs.push(`/PORT:${process.env.PORT || 9945}`)
}


child_process.spawn(
  command,
  myArgs,
  {
    env,
    stdio: [process.stdin, process.stdout, process.stderr],
  }
).on("exit", (code) => {
  process.exit(code)
})


