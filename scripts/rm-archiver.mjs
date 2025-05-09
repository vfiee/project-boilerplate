#!/usr/bin/env zx

const projectPath = path.join(__dirname, "../")

await $`rm -rf ${projectPath}/dist.zip`

