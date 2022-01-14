module.exports = function log(message) {
    var time = new Date(Date.now());
    console.log("[LOG " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "]\t" + message );
}