import { ProblemInfo, TestCase, ParamPair } from "../../../common/interfaces";

const contestProblemsStoragePre = "contest-problems.";

/**
 * 获取代码编辑器中的代码
 */
function getEditorCode() {
	const code: string =
		// 从 monaco editor 读取
		window.monaco?.editor.getEditors()[0]?.getModel().getValue()
		// 从页面的编辑框读取，只能读取10行
		|| (document.querySelector("textarea.inputarea") as HTMLTextAreaElement)?.value
	return code || "";
}

/**
 * 从 monaco 编辑器获取编程语言
 */
function getLanguageFromEditor(): string {
	try {
		return monaco.editor.getEditors()[0]?.getModel()
			?._tokenizationTextModelPart?._languageId
			|| monaco.editor.getEditors()[0]
				?._modelData.viewModel?.cursorConfig?._languageId;
	} catch (err) {
		console.error(err);
		return "";
	}
}

/**
 * 从切换的按钮上获取编程语言
 * @returns 编程语言的名称（全小写）
 */
function getLanguageFromButton(): string {
	let lang = document.querySelector("[id^=headlessui-popover-button-] > div > button.whitespace-nowrap.inline-flex.bg-transparent")
		?.textContent;
	if (!lang) return "";
	lang = lang.toLowerCase();
	if (lang == "c++") lang = "cpp";
	else if (lang == "c#") lang = "csharp";
	return lang;
}

/**
 * 从题目URL中提取英文题目名
 */
function extractEngNameFromURL(url: string): string {
	const match = url.match(/\/problems\/(.+?)\//);
	return match ? match[1] : "";
}

/**
 * 从 URL 中提取竞赛名称，
 */
function extractContestNameFromURL(url: string): string {
	// 周赛：https://leetcode.cn/contest/weekly-contest-403/*
	// 双周赛：https://leetcode.cn/contest/biweekly-contest-134/*
	const m = url.match(/\/contest\/(.+?)\//);
	return m ? m[1] : "";
}

/**
 * 从网页中查找题目标题元素
 */
export function queryProbTitleElem() {
	return document.querySelector(".text-title-large > a");
}

/**
 * 从网页中提取题目的 id 和名称
 */
function extractProblemIdAndName(): [string, string] {
	// 从网页标题提取。存在问题：竞赛页面的标题没有id
	// return document.title.split(" - ")[0].split(". ") as [string, string];

	const title = queryProbTitleElem();
	if (!title) return ["", ""];
	const m = title.textContent.match(/^(.+?)\.(.+)$/);
	if (!m) return ["", title.textContent.trim()];
	return [m[1], m[2].trim()];


}

/**
 * 将输入用例的字符串解析为键值对
 */
function parseInputCase(input: string): [string, ParamPair[]] {
	// 预处理
	input = input
		.trim() // 去除首尾空白字符
		.replace(/，/g, ",") // 将中文逗号替换为英文逗号
	const rawInput = input;
	const pattern = /,?\s*(\w+)\s*=/g;
	const matches = input.matchAll(pattern);
	const cases: ParamPair[] = [];
	let lastIdx = -1; // 上一次匹配到的右端索引
	for (const k of matches) {
		if (lastIdx != -1) {
			cases.at(-1).value = input.slice(lastIdx, k.index).trim();
		}
		lastIdx = k.index + k[0].length;
		cases.push({ key: k[1], value: "" });
	}
	if (cases.length) {
		cases.at(-1).value = input.slice(lastIdx).trim();
	} else {
		// 只有一个参数的情况下，输入用例中可能不包含变量名
		cases.push({ key: "", value: input });
	}
	return [rawInput, cases]
}

/**
 * 从题目的输入输出示例中提取测试用例
 */
function extractTestCases() {
	// 正则提取的范围
	const htmlText = document.body.innerText;

	// 正则提取测试用例
	// 根据html标签匹配（以弃用）
	// const examplePattern = /<(?:strong|b)>输入：<\/(?:strong|b)>([\s\S]*?)<(?:strong|b)>输出：<\/(?:strong|b)>([\s\S]*?)</g;
	// 根据 text 的固定格式匹配
	// 捕获 输入： 和 输出： 之间的所有文本，以及 输出： 和任何一个非ASCII字符 之间的所有文本
	const examplePattern = /示例[\s\S]+?输入[：:]([\s\S]*?)输出[：:]([\s\S]*?)(?=[^\x00-\x7F])/g;
	// 兼容英文版题目，原理同上，“输出”的匹配结束位置指定为具体的关键字，包括： Explanation: 或 Constraints: 或 Input:。
	const examplePatternInEng = /Example[\s\S]+?Input:([\s\S]*?)Output:([\s\S]*?)(?=(Explanation:|Constraints:|Input:))/g;

	// 先尝试匹配中文，不行再换英文
	const exampleMatches = new RegExp(examplePattern).test(htmlText) ? // 创建临时的正则对象，以避免全局正则的 lastIndex 被修改
		htmlText.matchAll(examplePattern) :
		htmlText.matchAll(examplePatternInEng);

	const testCases: TestCase[] = [];

	for (const example of exampleMatches) {
		const [rawInput, input] = parseInputCase(example[1]);
		const output = example[2].trim().replace(/，/g, ",");
		testCases.push({ rawInput, input, output });
	}

	console.log("examples: ", testCases);
	return testCases;
}

/**
 * 从网页中提取题目信息
 */
export function extractProblemInfo(): ProblemInfo {
	const prob = {} as ProblemInfo;

	// 检测语言
	prob.langName = getLanguageFromEditor() || getLanguageFromButton();
	if (!prob.langName) {
		throw "未检测到当前编程语言";
	}

	// 获取编辑器中的代码
	prob.editorCode = getEditorCode();
	if (!prob.editorCode) {
		throw "未获取到编辑框的代码";
	}

	// 获取URL中的英文题目名
	prob.engName = extractEngNameFromURL(location.pathname);
	if (!prob.engName) {
		throw new Error("未获取到英文题目名称");
	}

	// 获取题目id和名称
	[prob.id, prob.name] = extractProblemIdAndName();
	if (!prob.name) {
		prob.name = prob.engName;
	}

	// 特殊处理竞赛页面的题目
	prob.isContest = location.pathname.startsWith("/contest/");
	if (prob.isContest) {
		prob.contestName = extractContestNameFromURL(location.pathname);
		if (!prob.contestName) {
			throw "未获取到竞赛名称";
		}
		// 读取存储的题目名列表
		let names;
		try {
			names = JSON.parse(localStorage.getItem(contestProblemsStoragePre + prob.contestName));
		} catch (err) {
			throw `解析题目列表出错${err}`;
		}
		prob.idInContest = `${names.indexOf(prob.engName) + 1}`;
	}

	// 提取题目中的测试用例
	prob.testCases = extractTestCases();

	return prob;
}

/**
 * 在竞赛页面等待题目列表出现并存储
 */
export function waitProblemListThenStore() {
	const contestName = extractContestNameFromURL(location.href);
	// 忽略已存储的场次
	if (contestName && localStorage.getItem(contestProblemsStoragePre + contestName)) return;

	// 监视页面变化，直到出现题目列表
	const observer = new MutationObserver(() => {
		const probNames = (Array.from(document.querySelectorAll("ul.contest-question-list > li > a")) as HTMLLinkElement[])
			.map(el => extractEngNameFromURL(el.href));
		if (probNames.length != 4) return;
		// 存储题目列表
		localStorage.setItem(contestProblemsStoragePre + contestName, JSON.stringify(probNames));
		observer.disconnect();
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

}
