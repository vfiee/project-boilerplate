export function setupHtmlPlugin(buildTime) {
	return {
		name: "html-plugin",
		apply: "build",
		transformIndexHtml(html) {
			return html.replace(
				"<head>",
				`<head>\n	<meta name="buildTime" content="${buildTime || Date.now()}" />`
			)
		}
	}
}
