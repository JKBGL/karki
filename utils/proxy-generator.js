const proxy = require('express-http-proxy')
const isValidKey = require('./is-valid-key')
const decodeFormData = require('./formDataDecode')
const encodeFormData = require('./formDataEncode')

const conf = require('../config')
const formDataEncode = require('./formDataEncode')

const base = (conf.proxy.baseUrl || 'https://osu.ppy.sh/api').replace(/\/+$/, "")
const u = new URL(base)
const basePath = u.pathname

const r = require('express').Router()

/**
 * 
 * @param {String} id 
 * @returns {import("express").Router()} proxy handler
 */
module.exports = (id) => {
    r.use(conf.proxy.enabled?.[id], proxy(u.host, {
        async filter(req, res) {
            if (conf.requireKey && (!req.params.k || !await isValidKey(req.params.k))) return false
            return conf.proxy?.enabled?.[id] ?? false
        },
        proxyReqPathResolver(req) {
            return basePath + conf.proxy.enabled?.[id]
        },
        proxyReqBodyDecorator(content) {
            content = content.toString()
            try {
                const json = JSON.parse(content)
                if (json['k-overwrite']) { 
                    json.k = json['k-overwrite']
                    delete json['k-overwrite']
                }
                return JSON.stringify(json)
            } catch(e) {
                try {
                    const form = decodeFormData(content)
                    if (!Object.keys(form).length) throw new Error('body is not formData')
                    if (form['k-overwrite']) { 
                        form.k = form['k-overwrite']
                        delete form['k-overwrite']
                    }
                    const result = formDataEncode(form)
                    return result.toString()
                } catch (error) {
                    console.error(error)
                    return content
                }
            }
        }
    }))
    return r
}