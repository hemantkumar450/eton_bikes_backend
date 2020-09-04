import asyncRedis from "async-redis";
import config from '../config';

class Redis {
    constructor() {
        this.client = null;
        return {
            set: this.set.bind(this),
            get: this.get.bind(this),
            hmSet: this.hmSet.bind(this),
            hmGet: this.hmGet.bind(this),
            flushAll: this.flushAll.bind(this),
            delete: this.delete.bind(this),
            init: this.init.bind(this)
        }
    }

    init() {
        this.client = asyncRedis.createClient({
            port: config.redis.port,
            host: config.redis.host,
            auth: config.redis.password,
            db: 4
        });
        this.client.on("error", function (err) {
            throw ('Error in Redis connection')
        });
        this.client.on('connect', function () {
            console.info('Redis connected')
        });
    }

    async set(key, value) {
        try {
            await this.client.set(key, value);
            return true;
        } catch (e) {
            throw (e)
        }
    }

    async get(key) {
        try {
            const value = await this.client.get(key);
            return value;
        } catch (e) {
            throw (e)
        }
    }

    async hmSet(key, value) {
        try {
            await this.client.hmset(key, value);
            return true;
        } catch (e) {
            throw (e)
        }
    }

    async hmGet(key) {
        try {
            return await this.client.hgetall(key);
        } catch (e) {
            throw (e)
        }
    }

    async flushAll(key) {
        try {
            await this.client.flushall(key);
            return true;
        } catch (e) {
            throw (e)
        }
    }

    async delete(key) {
        try {
            await this.client.del(key);
            return true;
        } catch (e) {
            throw (e)
        }
    }

    _checkKey() {
        // To do
    }
}

export default new Redis();