var { env } = require("./scripts/env.js")

Object.assign(process.env, env)

require("process").on('uncaughtException', (e) => {
  console.error(e)
})

const ewam = require("@ewam/node-hosting")
const express = require("express")

ewam.connect({
  runtimeMode: "IDE",
  options: {
    "show-model-annotation": true,
    "minimize-model-annotation": true,
    "use-X-Wyde-Profiling": true,
    "enableInteract": true,
    "dontCatchException": true
  },
  administrator: {
    services: [
      { className: "aSystemIDEService" },
      { className: "aSystemInspectorService" },
      { className: "aSystemFSService", reset: false },
      { className: "aDocumentationService" },
    ]
  }
})

const app = express()
app.use(ewam.getAdministrator().dispatchHttpRequest)
const server = app.listen(process.env.IDE_PORT || 9955, function () {
  const port = server.address().port
  console.log(`⚡️ [eWam IDE Service]: listening at http://localhost:${port}`)
})
