import React, { useState } from 'react'
import { ReactComponent as Caret } from '../assets/svg/caret.svg'

export default function Dropdown({items, selected, updateSelected}) {
  const [open, setOpen] = useState(false);

  function DpItem({name}) {
    return (
      <div className="dp-menu__item" onClick={() => {
          updateSelected(name)
          setOpen(false);
        }}>
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
