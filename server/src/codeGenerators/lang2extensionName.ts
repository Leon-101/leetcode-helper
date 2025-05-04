// 利用 Monaco 获取所有支持的语言及其扩展名
/*
Object.fromEntries(
	monaco.languages.getLanguages()
		.filter(lang => lang.extensions?.length)
		.map(lang => [lang.id, lang.extensions[0]])
);
*/

export const lang2extensionName = {
	"plaintext": ".txt",
	"python": ".py",
	"python3": ".py",
	"cpp": ".cpp",
	"c": ".c",
	"csharp": ".cs",
	"css": ".css",
	"golang": ".go",
	"html": ".html",
	"java": ".java",
	"javascript": ".js",
	"kotlin": ".kt",
	"markdown": ".md",
	"php": ".php",
	"ruby": ".rb",
	"rust": ".rs",
	"scala": ".scala",
	"racket": ".scm",
	"bash": ".sh",
	"sql": ".sql",
	"swift": ".swift",
	"typescript": ".ts",
	"vue": ".vue",
	"erlang": ".erl",
	"elixir": ".ex",
	"cangjie": ".cj",
	"dart": ".dart",
};
