export default function hasQuantative(model) {
  let flag = false
  function has(item) {
    if (item.selectionSet) {
      item.selectionSet.selections.forEach((i) => {
        console.log(i.typeInfo.toString())
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
    // model.selectionSet.selections.forEach((item) => {
    //   has(item)
    //   console.log('flag = ', flag)
    // })
  }
  return flag
}
