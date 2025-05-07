#!/usr/bin/env zx

const distPath = path.join(__dirname, "../dist")

await $`zip -q -r dist.zip ${distPath}`

