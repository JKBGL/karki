const OsuUser = {
    user_id: 0,
    username: "",
    join_date: 0,
    count300: 0,
    count100: 0,
    count50: 0,
    playcount: 0,
    ranked_score: 0,
    total_score: 0,
    pp_rank: 0,
    level: 0,
    pp_raw: 0,
    accuracy: 0,
    count_rank_ss: 0,
    count_rank_ssh: 0,
    count_rank_s: 0,
    count_rank_sh: 0,
    count_rank_a: 0,
    country: "",
    total_seconds_played: 0,
    pp_country_rank: 0,
    events: []
};

const OsuScore = {
    score_id: 0,
    score: 0,
    username: "",
    count300: 0,
    count100: 0,
    count50: 0,
    countmiss: 0,
    maxcombo: 0,
    countkatu: 0,
    countgeki: 0,
    perfect: false,
    enabled_mods: 0,
    user_id: 0,
    date: 0,
    rank: "",
    pp: 0,
    replay_available: false
}

module.exports = {
    OsuUser,
    OsuScore
};