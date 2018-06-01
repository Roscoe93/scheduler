const Deferred = require("./deferred.js");
module.exports = class Scheduler {
	constructor(options) {
		let { maxParallel = 1000 } = options;
		this.doing = 0;
		this.pool = [];
		this.maxParallel = maxParallel;
	}

	do(fn, opts = {}) {
		let { timeout, ctx } = opts;
		let deferred = Deferred();
		let task = {
			fn,
			ctx,
			deferred,
			timeout
		};
		if (this.doing < this.maxParallel) {
			this.execute(task);
		} else {
			this.pool.push(task);
		}
		return deferred.promise;
	}

	async execute({ fn, ctx, deferred, timeout }) {
		this.doing++;
		let exceeded = false;
		if (timeout) {
			setTimeout(() => {
				deferred.reject(`timeout ${timeout}ms`);
				exceeded = true;
				this.doing--;
				this.next();
			}, timeout);
		}
		try {
			let ret = await fn.call(ctx);
			deferred.resolve(ret);
		} catch (error) {
			deferred.reject(error);
		}
		if (!exceeded) {
			this.doing--;
			this.next();
		}
	}

	next() {
		if (!this.pool.length) return;
		let task = this.pool.shift();
		this.execute(task);
	}
};
