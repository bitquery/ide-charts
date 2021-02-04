export default function hasQuantative(model) {
  let flag = false
  function has(item) {
    if (item.selectionSet) {
      item.selectionSet.selections.forEach((i) => {
        if (
          i.typeInfo.toString().includes('Int') ||
          i.typeInfo.toString().includes('Float')
        ) {
          flag = true
        } else {
          has(i)
        }
      })
    }
  }
  if (model.selectionSet) {
		has(model)
  }
  return flag
}
