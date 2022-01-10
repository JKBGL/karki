//formats timestamps to mimic bancho v1's format
module.exports = function getTimestamp (d) {
    const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
