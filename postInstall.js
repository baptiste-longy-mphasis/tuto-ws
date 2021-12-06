var { command, file, directory, print } = require("@ewam/script.cli")
const Path = require("path")

function copyTGVs(artifactName) {
  command.exec("npm install " + artifactName)
  print.info(`copying ${artifactName} tgvs`)
  directory.copy(Path.resolve("./node_modules/" + artifactName), Path.resolve("./TGV"))
  command.exec("npm uninstall " + artifactName)
}

async function downloadTGVs() {
  if (file.exists("./TGV/W001001.TGV")) {
    console.log("Leaving TGVs alone as you already have it configured")
  } else {
    // We can't find any TGV, download it
    console.log(
      "🔥🔥🔥Downloading TGVs🔥🔥🔥.... Please grab a ☕ and come back in a couple of minutes depending on your internet speed"
    )
    try {
      copyTGVs("@ewam/tgv-standalone")
      command.exec("npm run ewam:patch-system")
      command.exec(`node ./scripts/installBundle.js --location ./Bundle/WAMCloud --name WAMCloud`)
      command.exec(`npm run ewam:cli -- --import ./src`)
    } catch (e) {
      print.error(
        "Some errors occured while we tried to download the welcome TGVs", e
      )
    }
  }
}

downloadTGVs()