export default function hasQuantativeAndDate(model) {
  let hasQuantative = false
  let hasDate = false
  function has(item) {
    if (item.selectionSet) {
      item.selectionSet.selections.forEach((i) => {
        if (i.typeInfo) {
          if (
            i.typeInfo.toString().includes('Int') ||
            i.typeInfo.toString().includes('Float')
          ) {
            hasQuantative = true
          } else if (
            i.typeInfo.name === 'Date' ||
            i.typeInfo.name === 'DateTime'
          ) {
            hasDate = true
          } else {
            has(i)
          }
        }
      })
    }
  }
  if (model.selectionSet) {
    has(model)
  }
  return hasDate && hasQuantative
}
