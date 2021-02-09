import React, { useEffect, useState } from 'react'

function WidgetOptions({ model, condition, value, setValue, title }) {
  let optionValue = ''
  const [show, setShow] = useState(true)
  useEffect(() => {
    if (model) {
      let list = condition()
      if (!value) {
        setValue(list[0])
      }
      if (value !== optionValue) {
      	setValue(optionValue)
      }

      if (list.length == 0) {
        setShow(false)
      } else {
        setShow(true)
      }
    }
  }, [JSON.stringify(model)])

  return (
    <div className="widget-option" style={{ display: show ? null : 'none' }}>
      <label>{title}</label>
      <select
        className="custom-select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={(select) => (optionValue = select?.value)}
      >
        {condition().length ? (
          condition().map((node, i) => (
            <option key={i} value={node}>
              {node}
            </option>
          ))
        ) : value ? (
          <option value={value}>{value}</option>
        ) : null}
      </select>
    </div>
  )
}

export default WidgetOptions
