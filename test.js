require("./server.js")
var assert = require("assert")
var ewam = require("@ewam/node-hosting")
const { exit } = require("process")

const stateless = ewam.getApplication("stateless")
var session = stateless.createSession("1")

const runAsync = async () => {
  const version = await session.get("/api/version")
  console.log(version)
  assert(version == "1.0.0")
  exit(0)
}

runAsync()