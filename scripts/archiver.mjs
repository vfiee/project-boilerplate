#!/usr/bin/env zx

const projectPath = path.join(__dirname, '../')

await $`cd ${projectPath}`

await $`zip -q -r dist.zip ./dist`
