# Scheduler

限制最大并发任务数

```javascript
const Scheduler = require("./scheduler")
// 初始化
let scheduler = new Scheduler({
	maxParallel: 10 // 最大并发
});

// 执行任务
// fn可以返回promise
let ret = await scheduler.do(fn, {
	timeout: undefined, // 超时毫秒数
	ctx: null // fn中的this指向
});
```
