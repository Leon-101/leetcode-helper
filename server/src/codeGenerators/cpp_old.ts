import { SourceFile, GenerateFiles, ProblemInfo, TestCase } from "../../../common/interfaces"

// 函数形参
class Parameter {
	name: string;
	type: string;
	constructor(str: string) {
		str = str.trim();
		const nameIndex = str.search(/\w+$/);
		this.name = str.slice(nameIndex);
		let type = str.slice(0, nameIndex).trim();
		// 引用类型的参数需去除&
		if (type.at(-1) == "&") type = type.slice(0, -1);
		this.type = type;
	}
}

// 类的成员函数
class MemberFunction {
	returnType;
	functionName;
	parametersList;
	constructor(returnType: string, functionName: string, parameters: string) {
		this.returnType = returnType;
		this.functionName = functionName;
		this.parametersList = parameters.split(",").map(p => new Parameter(p));
	}
}

// C++ 代码生成器
class CPPGenerator {
	originalCode: string;
	testCases: TestCase[];
	className: string = "";
	memberFunctions: MemberFunction[] = [];

	constructor(code: string, testCases: TestCase[]) {
		if (!code) {
			throw new Error("code is empty");
		}
		this.originalCode = code;
		this.testCases = testCases;
		this._parse();
	}

	private _parse() {
		let code = this.originalCode;

		const headMatch = code.match(/\bclass\s+(\w+)/) ?? "";
		this.className = headMatch && headMatch[1];
		if (this.className == "") {
			throw new Error("class name is empty");
		}

		const bodyMatch = code.match(/public:([\s\S]+)(private:)?/) ?? "";
		code = bodyMatch && bodyMatch[1];
		if (!code) {
			throw new Error("class body is empty");
		}

		const memberFunctionPattern = /([\w< >\*]+)\s+(\w+)\s*\((.*?)\)\s*\{/g;
		const memberFunctionMatches = code.matchAll(memberFunctionPattern);
		this.memberFunctions = [];
		for (const m of memberFunctionMatches) {
			const [, returnType, functionName, parameters] = m;
			this.memberFunctions.push(new MemberFunction(returnType, functionName, parameters));
		}
		if (this.memberFunctions.length == 0) {
			throw new Error("no member function found");
		}

		// 数据结构题
		if (this.className != "Solution") {
			// todo
		}
	}

	private _removeComment(code: string) {
		// 匹配单行注释和多行注释
		const regex = /\/\/.*|\/\*[\s\S]*?\*\//g;
		return code.replace(regex, "");
	}

	// 生成 main.cpp 的代码
	generateMainCPP() {
		return this.className == "Solution" ? this._generalMainCpp() : this._mainCppForDsa();
	}

	// 生成 solution.cpp 的代码
	generateSolutionCpp() {
		return `#ifdef __LOCAL
#include "leetcode.h"
#endif

${this.originalCode}
`;
	}

	// 常规题目（非数据结构题）
	private _generalMainCpp() {
		const testCases = this.testCases.map(tc => {
			return `[
	${tc.input.map(p => p.value).join(",\n\t")},
	${tc.output}
]`;
		});

		const template = `#include "leetcode.h"
#include "solution.cpp"

int main()
{
	json testCases = json::parse(R"""([
${testCases.join(",\n")}
])""");

	int _num = 1, _passCnt = 0;
	for (auto &testCase : testCases)
	{
		auto ${this.memberFunctions[0].parametersList.map((p, i) => `${p.name} = testCase[${i}].get<${p.type}>()`).join(", ")};
		Timer _timer(_num);
		_timer.start();
		Solution solution;
		auto ans = solution.${this.memberFunctions[0].functionName}(${this.memberFunctions[0].parametersList.map(p => p.name).join(", ")});
		_timer.stopAndPrint();
		_passCnt += judge(_num++, testCase, ans);
	}

	cout << "Passed " << _passCnt << "/" << testCases.size() << " cases" << endl;
	return 0;
}`
		return template;
	}

	// 数据结构题
	private _mainCppForDsa() {
		// todo
		return "ing";
	}
};

/**
 * 根据给定的题目信息，生成代码文件的内容以及保存路径，支持多文件
 */
export const generateFiles: GenerateFiles = (prob: ProblemInfo): SourceFile[] => {
	const generator = new CPPGenerator(prob.editorCode, prob.testCases);
	let dirName = `${prob.id}.${prob.name}`;
	if (prob.isContest) {
		const [contestType, , contestId] = prob.contestName.split("-");
		dirName = `contest/${contestType}/${contestId}/Q${prob.idInContest}.${prob.name}`;
	}
	return [
		{
			filePath: `${dirName}/solution.cpp`,
			fileContent: generator.generateSolutionCpp(),
		},
		{
			filePath: `${dirName}/main.cpp`,
			fileContent: generator.generateMainCPP(),
		},
	];
}
