module.exports = (raw) => {
  return decodeURIComponent(raw)
    .split('&')
    .reduce((form, cur) => {
      const decodedData = decodeURIComponent(cur.replace(/\+/g, '%20'))
      const [k, v] = decodedData.split('=')
      form[k] = v

      return form
    },{})
}