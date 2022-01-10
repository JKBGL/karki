const config = {};

//karki's init settings
config.host         = '0.0.0.0';
config.port         = 8080;


// MYSQL settings to interface with the gulag database
// default pool size = 10
config.mysql = {
    db      : "gulag",
    host    : "127.0.0.1",
    port    : 3306,
    user    : "root",
    pass    : "",
    pool    : 10
};

// If the server should run in restricted safe mode
// and require an api key passed as an argument "k".
// default = true
config.requireKey = true;

// Rate limiting the api (per ip)
// this can be used instead or along with config.requireKey
// for servers that wish to have an open api
// NOTE: time is in ms
// defaults = 500, 300000 (5 minutes)
config.ratelimit = {
    requests: 500,
    time: 300000
};

// Various server messages
// usually used for better compatibility with api receivers.
// defaults:
// config.messages = {
//     rate_limited:       "{ message: \"Rate limit reached.\", code: 429 }",
//     server_error:       "{ message: \"Internal server error.\", code: 500 }",
//     invalid_api_key:    "{ error: \"Invalid api key.\", code: 403 }",
//     invalid_user_param: "{ error: \"Invalid username or user id.\", code: 403 }",
//     missing_bmap_param: "{ error: \"Beatmap id required.\", code: 403 }"
// }
config.messages = {
    rate_limited:       "{ message: \"Rate limit reached.\", code: 429 }",
    server_error:       "{ message: \"Internal server error.\", code: 500 }",
    invalid_api_key:    "{ error: \"Invalid api key.\", code: 403 }",
    invalid_user_param: "{ error: \"Invalid username or user id.\", code: 403 }",
    missing_bmap_param: "{ error: \"Beatmap id required.\", code: 403 }"
}

// Disables the "@/" endpoint which
// returns basic karki version info.
// default = false
config.disable_main = false;


// unavailable api proxy
config.proxy = {
    enabled: [
        'api-get-beatmaps'
    ],
    baseUrl: process.env.PROXY_BANCHO_API_V1_BASE_URL || 'https://osu.ppy.sh/api'
}



//export config
config.version = "0.11.6b";
module.exports = config;