#!/usr/bin/env zx

const projectPath = path.join(__dirname, '../')

await $`cd ${projectPath}`

await $`rm -rf ./dist.zip`
