const proxy = require('express-http-proxy')
const isValidKey = require('./is-valid-key')

const conf = require('../config')

const base = (conf.proxy.baseUrl || 'https://osu.ppy.sh/api').replace(/\/+$/, "")
const u = new URL(base)
const basePath = u.pathname

const r = require('express').Router()
module.exports = (id) => {
    r.use(conf.proxy.enabled?.[id], proxy(u.host, {
        async filter(req, res) {
            if (conf.requireKey && (!req.params.k || !await isValidKey(req.params.k))) return false
            return conf.proxy?.[id] ?? false
        },
        proxyReqPathResolver(req) {
            return basePath + conf.proxy.enabled?.[id]
        }
    }))
    return r
}