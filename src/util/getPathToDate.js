import flat from 'flat'
import moment from 'moment'

export default function getPathToDate(obj, dateTimeFormat) {
  const paths = flat(obj)
  return Object.keys(paths).find((path) => {
    return moment(paths[path], dateTimeFormat.replaceAll('%', '').toUpperCase(), true).isValid()
  })
}
