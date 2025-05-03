export interface ParamPair {
	key: string; // 参数名称
	value: string; // 参数值（JSON字符串）
};

export interface TestCase {
	input: ParamPair[];
	rawInput: string; // 未拆分的输入参数列表
	output: string; // 一个JSON字符串
};

export interface ProblemInfo {
	id: string; // 题目ID
	name: string; // 标题中显示的题目名称（可能是中文货英文，跟随用户设置变化）
	engName: string; // URL中的英文题目名称
	langName: string; // 编程语言的名称，由小写字母组成
	editorCode: string; // 代码编辑器中的代码
	isContest: boolean; // 是否是竞赛中的题目
	contestName: string; // URL 中的竞赛名称
	idInContest: string; // 比赛时的题目序号
	testCases: TestCase[]; // 题目中给出的输入输出示例
};

export interface SourceFile {
	filePath: string;
	fileContent: string;
};

export interface GenerateFiles {
	(prob: ProblemInfo): SourceFile[];
};

export interface FileCreationResult {
	filePath: string;
	success: boolean;
	message: string;
};

export interface afterFileCreationSuccess {
	(results: FileCreationResult[]): void;
};

declare global {
	var monaco: any;
	var pageData: any;
}
