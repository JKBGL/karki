const express = require('express');
const rlimit = require('express-rate-limit');
//const compressor = require('compression');
const config = require('./config');
const db = require('./utils/db');
const { OsuUser, OsuScore } = require('./utils/objects');

const log = require('./utils/logger')
const getTimestamp = require('./utils/timestamp')
const isValidKey = require('./utils/is-valid-key')
//respond to request
// function respond(res, text) {
//     res.statusCode = 200;
//     //res.setHeader('Content-Type', 'text/plain');
//     res.setHeader('Content-Type', 'text/html');
//     res.end(text);
// }


const routes = router = express.Router()
const apiL = rlimit({
    windowMs: config.ratelimit.time,
    max: config.ratelimit.requests,
    message: config.messages.rate_limited
});
routes.use("/", apiL);
//routes.use(compressor());       //enable gzip

// Routes
// Docs:
// @/                   - done
// @/get_beatmaps       - will not be handled (?)
// @/get_user           - done
// @/get_scores         - done
// @/get_user_best      - done
// @/get_user_recent    - done
// @/get_match          - will not be handled (?)
// @/get_replay         - use gulag's built in endpoint

//show api versioning on ping if config.disable_main is not false
routes.get("/", (req, res, next) => {
    log(req.ip + "\t" + req.originalUrl);
    if (config.disable_main) {
        res.statusCode = 404;
        res.end();
        return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<html><style>html {font: 25px 'arial'; background: #000; color: #fff; text-align: center; } a {color: #cca700; text-decoration: none;} a:hover {color: red;}</style>karki v${ config.version } osu api v1 server for gulag by Jakatebel with love &hearts;<br><a href='https://jkbgl.net/'>JKBGL.NET</a></html>`);
});

// HANDLED.
// k - done
// m - done, includes gulag modes
// type - not needed
// event_days - not
routes.get("/get_user", async (req, res, next) => {
    log(req.ip + "\t" + req.originalUrl);
    var params = req.query;
    
    var xkey = await isValidKey(params.k);
    if (!xkey) {
        log(req.ip + "\t" + req.originalUrl + " - invalid key");
        res.end(config.messages.invalid_api_key);
        return;
    }

    var us = params.u;
    if (!us || us == "") {
        res.end(config.messages.invalid_user_param);
        return;
    }
    try {
        var data;
        var stat_data;
        const a = new Object(OsuUser);
        if (!isNaN(us)) {
            data = await db.query("SELECT * FROM users WHERE `id` = ?", us);
            console.log(data);
        } else {
            data = await db.query("SELECT * FROM users WHERE `name` = ? OR `safe_name` = ?", [ us, us ]);
        }

        data = data[0];
        a.user_id = data.id;
        a.username = data.name;
        a.country = data.country;
        a.join_date = getTimestamp(new Date(data.creation_time * 1000)); //from unix timestamp //convert format!
        
        var mode = 0;
        if (!isNaN(params.m) && params.m >= 0 && params.m < 8) mode = params.m;

        stat_data = await db.query("SELECT * FROM stats WHERE `id` = ? AND `mode` = ?", [ data.id, mode ]);
        stat_data = stat_data[0];

        a.playcount = stat_data.plays;
        a.total_score = stat_data.tscore;
        a.ranked_score = stat_data.rscore;
        a.pp_raw = stat_data.pp;
        a.total_seconds_played = stat_data.playtime;
        a.accuracy = stat_data.acc;
        a.count_rank_ssh = stat_data.xh_count
        a.count_rank_ss = stat_data.x_count
        a.count_rank_sh = stat_data.sh_count
        a.count_rank_s = stat_data.s_count
        a.count_rank_a = stat_data.a_count
        
        //undefined
        a.level = -1; // broken for now
        a.pp_rank = -1;
        a.count300 = -1;
        a.count100 = -1;
        a.count50 = -1;
        a.pp_country_rank = -1;


        console.log(a);
        res.json(a);
    } catch (ex) {
        log("Server encountered an error: ");
        console.log(ex);
        res.end(config.messages.server_error);
    }
    //res.end();
});

// HANDLED
// k
// b
// u - not yet
// m - done, includes gulag modes
// mods
// type - not needed
// limit - 1-500, default : 100
routes.get("/get_scores", async (req, res, next) => {
    log(req.ip + "\t" + req.originalUrl);
    var params = req.query;

    var xkey = await isValidKey(params.k);
    if (!xkey) {
        log(req.ip + "\t" + req.originalUrl + " - invalid key");
        res.end(config.messages.invalid_api_key);
        return;
    }

    var bid = params.b;
    if (!bid || bid == "") {
        res.end(config.messages.missing_bmap_param);
        return;
    }

    var us = params.u;
    //if (!us || us == "")

    var mode = 0;
    if (!isNaN(params.m) && params.m >= 0 && params.m < 8) mode = params.m;

    var mods = -1;
    if (!isNaN(params["mods"])) mods = parseInt(params["mods"]);

    var limit = 100;
    if (!isNaN(params["limit"]) && params["limit"] > 0 && params["limit"] < 501) limit = parseInt(params["limit"]);
    
    try {
        var bmap_data = await db.query("SELECT `md5`, `id`, `set_id` FROM maps WHERE `id` = ?", params.b);
        bmap_data = bmap_data[0];
        
        var table = mode < 4 ? 'scores_vn' : mode < 7 ? 'scores_rx' : 'scores_ap';
        var score_data = await db.query(`SELECT ${ table }.*, users.name FROM ${ table } INNER JOIN users ON ${ table }.userid = users.id WHERE \`map_md5\` = ? ${ mods != -1 && !isNaN(mods) ? "AND \`mods\` = " + mods : "" } AND status = 2 AND mode = ? ORDER BY pp DESC, score DESC LIMIT ?`, [ bmap_data.md5, mode, limit ]);

        var arr = new Array();
        for (var x in score_data) {
            const b = score_data[x];
            var a = new Object(); // NEVER USE THE OsuScore OBJECT OR ANY OBJECT PROTOTYPE IN A LOOP. EVER.
            a.score_id = b.id;
            a.score = b.score;
            a.username = b.name;
            a.count300 = b.n300;
            a.count100 = b.n100;
            a.count50 = b.n50;
            a.countmiss = b.nmiss;
            a.maxcombo = b.max_combo;
            a.countkatu = b.nkatu;
            a.countgeki = b.ngeki;
            a.perfect = b.perfect;
            a.enabled_mods = b.mods;
            a.user_id = b.userid;
            a.date = getTimestamp(b.play_time);
            a.rank = b.grade;
            a.pp = b.pp;
            a.replay_available = b.online_checksum ? 1 : 0;
            arr.push(a);
        }

        //console.log(arr);
        res.json(arr);
    } catch (ex) {
        log("Server encountered an error: ");
        console.log(ex);
        res.end(config.messages.server_error);
    }
});

// k
// u
// m - includes gulag modes
// limit
// type - not needed
routes.get("/get_user_best", async (req, res, next) => {
    log(req.ip + "\t" + req.originalUrl);
    var params = req.query;

    var xkey = await isValidKey(params.k);
    if (!xkey) {
        log(req.ip + "\t" + req.originalUrl + " - invalid key");
        res.end(config.messages.invalid_api_key);
        return;
    }

    var us = params.u;
    if (!us || us == "") {
        res.end(config.messages.invalid_user_param);
        return;
    }

    try {
        if (isNaN(us)){
            us = await db.query("SELECT id FROM users WHERE `name` = ? OR `safe_name` = ?", [ us, us ]);
            us = us[0].id;
        }

        if(isNaN(us)) {
            res.end(config.messages.invalid_user_param);
            return;
        }

        var mode = 0;
        if (!isNaN(params.m) && params.m >= 0 && params.m < 8) mode = params.m;

        var limit = 100;
        if (!isNaN(params["limit"]) && params["limit"] > 0 && params["limit"] < 501) limit = parseInt(params["limit"]);
        
        var bmap_data = await db.query("SELECT `md5`, `id`, `set_id` FROM maps WHERE `id` = ?", params.b);
        bmap_data = bmap_data[0];
        
        var table = mode < 4 ? 'scores_vn' : mode < 7 ? 'scores_rx' : 'scores_ap';
        var score_data = await db.query(`SELECT ${ table }.*, maps.id AS beatmap_id FROM ${ table } INNER JOIN maps ON ${ table }.map_md5 = maps.md5 WHERE \`userid\` = ? AND ${ table }.status = 2 AND maps.status IN (2, 3) AND ${ table }.\`mode\` = ? ORDER BY pp DESC, score DESC LIMIT ?`, [ us, mode, limit ]);

        var arr = new Array();
        for (var x in score_data) {
            const b = score_data[x];
            var a = new Object();
            a.beatmap_id = b.beatmap_id;
            a.score_id = b.id;
            a.score = b.score;
            a.maxcombo = b.max_combo;
            a.count50 = b.n50;
            a.count100 = b.n100;
            a.count300 = b.n300;
            a.countmiss = b.nmiss;
            a.countkatu = b.nkatu;
            a.countgeki = b.ngeki;
            a.perfect = b.perfect;
            a.enabled_mods = b.mods;
            a.user_id = b.userid;
            a.date = getTimestamp(b.play_time);
            a.rank = b.grade;
            a.pp = b.pp;
            a.replay_available = b.online_checksum ? 1 : 0;
            arr.push(a);
        }

        
        res.json(arr);
    } catch (ex) {
        log("Server encountered an error: ");
        console.log(ex);
        res.end(config.messages.server_error);
    }
});


// k
// u
// m - includes gulag modes
// limit
// type - not needed
routes.get("/get_user_recent", async (req, res, next) => {
    log(req.ip + "\t" + req.originalUrl);
    var params = req.query;

    var xkey = await isValidKey(params.k);
    if (!xkey) {
        log(req.ip + "\t" + req.originalUrl + " - invalid key");
        res.end(config.messages.invalid_api_key);
        return;
    }

    var us = params.u;
    if (!us || us == "") {
        res.end(config.messages.invalid_user_param);
        return;
    }

    try {
        if (isNaN(us)){
            us = await db.query("SELECT id FROM users WHERE `name` = ? OR `safe_name` = ?", [ us, us ]);
            us = us[0].id;
        }

        if(isNaN(us)) {
            res.end(config.messages.invalid_user_param);
            return;
        }

        var mode = 0;
        if (!isNaN(params.m) && params.m >= 0 && params.m < 8) mode = params.m;

        var limit = 100;
        if (!isNaN(params["limit"]) && params["limit"] > 0 && params["limit"] < 501) limit = parseInt(params["limit"]);
        
        var bmap_data = await db.query("SELECT `md5`, `id`, `set_id` FROM maps WHERE `id` = ?", params.b);
        bmap_data = bmap_data[0];
        
        var table = mode < 4 ? 'scores_vn' : mode < 7 ? 'scores_rx' : 'scores_ap';
        var score_data = await db.query(`SELECT ${ table }.*, maps.id AS beatmap_id FROM ${ table } INNER JOIN maps ON ${ table }.map_md5 = maps.md5 WHERE \`userid\` = ? AND maps.status IN (2, 3) AND ${ table }.\`mode\` = ? LIMIT ?`, [ us, mode, limit ]);

        var arr = new Array();
        for (var x in score_data) {
            const b = score_data[x];
            var a = new Object();
            a.beatmap_id = b.beatmap_id;
            a.score_id = b.id;
            a.score = b.score;
            a.maxcombo = b.max_combo;
            a.count50 = b.n50;
            a.count100 = b.n100;
            a.count300 = b.n300;
            a.countmiss = b.nmiss;
            a.countkatu = b.nkatu;
            a.countgeki = b.ngeki;
            a.perfect = b.perfect;
            a.enabled_mods = b.mods;
            a.user_id = b.userid;
            a.date = getTimestamp(b.play_time);
            a.rank = b.grade;
            a.pp = b.pp;
            a.replay_available = b.online_checksum ? 1 : 0;
            arr.push(a);
        }
        
        res.json(arr);
    } catch (ex) {
        log("Server encountered an error: ");
        console.log(ex);
        res.end(config.messages.server_error);
    }
});

//export routes
module.exports = routes;
