export function parseQuery(url) {
  const params = {}
  const match_query = url.match(/\?(.*)#?/)
  const query_str = match_query[1]
  const query_arr = query_str.split('&')
  query_arr.forEach(el => {
    const [key, value] = el.split('=')
    params[key] = value
  })
  return params
}
