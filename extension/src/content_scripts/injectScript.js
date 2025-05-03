export function injectScript(src) {
	const script = document.createElement("script");
	script.src = src;
	script.type = "module";
	script.onload = e => {
		e.target.remove();
	}
	(document.head || document.documentElement).appendChild(script);
}
