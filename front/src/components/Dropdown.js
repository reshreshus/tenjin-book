import React, { useState } from 'react'
import { ReactComponent as Caret } from '../assets/svg/caret.svg'

export default function Dropdown({items, selected, updateSelected}) {
  function DpItem({name}) {
    return (
      <div className="dp-menu__item" onClick={() => updateSelected(name)}>
        { name }
      </div>
    )
  }

  function DpMenu({children}) {
    return (
      <div className="dp-menu">
        {children}
      </div>
    )
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="dp">
      <div className="dp__input" onClick={() => setOpen(!open)}>
        { selected } <Caret />
      </div>
      {
        open &&
        <DpMenu>
          {
            items.map(it =>
              <DpItem name={it}/>
            )
          }
        </DpMenu>
      }
    </div>
  )
}
