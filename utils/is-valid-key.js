const db = require('../utils/db');
//verifies if the endpoint has a valid key
module.exports = async function isValidKey(k) {
    if (config.requireKey && k != undefined && k != "") {
        var t = null;
        try {
            t = await db.query("SELECT `name`, `api_key` FROM users WHERE `api_key` = ?", k);
        } catch { } // failed db query
        if (t != undefined && t != null && t != "") {
            return t[0];
        } else
            return false;

    } else
        return true;
}