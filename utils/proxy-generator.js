const proxy = require('express-http-proxy')
const isValidKey = require('./utils/is-valid-key')

const conf = require('../config')

module.exports = (id) => proxy(u.host, {
    async filter(req, res) {
        if (conf.requireKey && (!req.params.k || !await isValidKey(req.params.k))) return false
        return conf.proxy.includes(id)
    },
    proxyReqPathResolver(req) {
        const base = (conf.proxy.baseUrl || 'https://osu.ppy.sh/api').replace(/\/+$/, "")
        const u = url.parse(base)
        const basePath = u.path
        return basePath + req.url
    }
})