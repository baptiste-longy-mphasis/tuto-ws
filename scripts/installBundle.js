const { script, command, directory } = require("@ewam/script.cli")
var { env } = require("../scripts/env.js")
const Path = require("path")
const Process = require("process")

script((argv) => {

  function getBundleLastVersion(versionsDirectory) {
    let lastVersion = 0
    for (const filename of directory.filenames(versionsDirectory)) {
      if (filename.toLowerCase().startsWith("upgrade_v")) {
        const version = parseInt(filename.substring("upgrade_v".length))
        if (version > lastVersion) lastVersion = version
      }
    }
    return lastVersion
  }

  function call(args, options) {
    return command.call("ewamconsole", args, { ...options, ignoreStatus: true })
  }

  function installBundle(location, name, reparse) {
    const lastVersion = getBundleLastVersion(location)
    if (lastVersion > 0) {
      console.log("> install bundle:", location)
      for (let version = 1; version <= lastVersion; version++) {
        const bundleTgv = `${location}\\upgrade_v${version}\\${name}.tgv`
        var args = [
          "/wydedeveloper",
          "/makedb",
          "/system",
          "/noerrormessage",
          "/run:xbundle.batchinstallbundle",
          "/bundle:" + bundleTgv,
          "/CONTENTSLOCKED"
        ]
        if (reparse) {
          args.push("/parsing")
        }
        call(args, { env })
      }
    }
    else throw new Error(`bundle '${name}' not found and cannot be install`)
  }
  //Let ewam install all version
  function turboinstallBundle(location, name, reparse) {
    const lastVersion = getBundleLastVersion(location)
    if (lastVersion > 0) {
      console.log("> turbo install bundle:", location)
      const bundleTgv = `${location}\\upgrade_v1\\${name}.tgv`
      var args = [
        "/wydedeveloper",
        "/makedb",
        "/system",
        "/noerrormessage",
        "/run:bundleinstaller.batchinstallbundle",
        "/bundle:" + bundleTgv,
        "/allversions"
      ]
      if (reparse) {
        args.push("/parsing")
      }
      call(args, { env })
    }
    else throw new Error(`bundle '${name}' not found and cannot be install`)
  }
  if (!argv.name) {
    argv.name = argv.location.split('/').pop()
  }
  if (argv.turbo) {
    turboinstallBundle(Path.resolve(argv.location), argv.name, argv.reparse)
  } else {
    installBundle(Path.resolve(argv.location), argv.name, argv.reparse)
  }
}, {
  arguments: {
    location: {
      type: "string",
      required: true,
    },
    name: {
      type: "string",
      required: false,
    },
    turbo: {
      type: "boolean",
      required: false
    },
    reparse: {
      type: "boolean",
      required: false
    }
  }
})

