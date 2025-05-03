import { SourceFile, GenerateFiles, ProblemInfo, TestCase } from "../../../common/interfaces"

/**
 * 根据给定的题目信息，生成代码文件的内容以及保存路径，支持多文件
 */
export const generateFiles: GenerateFiles = (prob: ProblemInfo): SourceFile[] => {
	let dirName = `${prob.id}.${prob.name}/`;
	if (prob.isContest) {
		const [contestType, , contestId] = prob.contestName.split("-");
		dirName = `contest/${contestType}/${contestId}/Q${prob.idInContest}.${prob.name}/`;
	}

	return [
		{
			filePath: `${dirName}/solution.txt`,
			fileContent: prob.editorCode, // 将网页编辑器中的代码原封不动写入
		},
		{
			filePath: `${dirName}/testcases.txt`,
			fileContent: prob.testCases.map(tc => tc.input.map(p => p.value).join("\n") + "\n" + tc.output).join("\n\n"), // 参考官方的用例格式
		},
	];
}
