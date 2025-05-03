import { extractProblemInfo, queryProbTitleElem, waitProblemListThenStore } from "./problems";
import { fetch, setInterval, location } from "./originalWindow";

const baseURL = "http://localhost:32000/api/";

// 竞赛页面(含题目列表)
if (/\/contest\/.+?\/$/.test(location.pathname)) {
	waitProblemListThenStore();
}
// 题目描述页面（包括普通题目和竞赛中的题目）
if (/\/problems\/.+?\/(description\/)?$/.test(location.pathname)) {
	document.addEventListener("DOMContentLoaded", solveLocal);
}

// 添加本地作答功能
function solveLocal() {
	const btn = document.createElement("button");
	btn.textContent = "　本地作答　";
	btn.style.cssText = `
  color: yellow !important;
  background-color: black !important;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

	btn.addEventListener("click", async e => {
		try {
			// 获取题目信息
			const prob = extractProblemInfo();
			// 交给服务端创建文件
			await postData(new URL("solve-local", baseURL), prob)
		} catch (e) {
			console.error(e);
			alert(e.toString());
		}
	});
	btn.style.all = "initial";// 不继承付层级的样式
	btn.style.cursor = "pointer";

	// 将按钮插入到标题后面，找不到标题的话最多等10秒
	let cnt = 0;
	const timerId = setInterval(() => {
		cnt++;
		if (cnt > 5) clearInterval(timerId);
		const t = queryProbTitleElem();
		if (!t) return;
		t.parentElement.insertBefore(btn, t.nextElementSibling);
		clearInterval(timerId);
	}, 2000);
}


async function postData(url: URL, data: Record<string, any>) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const responseData = await response.json();
		if (!response.ok) {
			throw new Error(responseData.message);
		}

		return responseData;
	} catch (err) {
		throw err;
		console.error(err);
	}
}
