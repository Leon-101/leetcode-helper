/**
 * 在其他脚本之前运行，导出 window 对象上的原始函数，以避免后续脚本修改全局函数带来的未知影响
 */

export const {
	fetch,
	setTimeout,
	setInterval,
	location,
} = window;
