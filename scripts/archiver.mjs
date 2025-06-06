#!/usr/bin/env zx

const projectPath = path.join(__dirname, "../")

await $`zip -q -r dist.zip ${projectPath}/dist`

