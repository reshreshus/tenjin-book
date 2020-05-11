import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = ({menuItems, appMenuItems, isAppMenuUsed}) => {

  const menu = isAppMenuUsed ? appMenuItems() : menuItems
  return (
    <CollectionConsumer>
    {
      ({hideContextMenu}) => {

        return (
          // TODO doesn't leave the mouse if we didn't enter it first!
          <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
            {
              menu.map((it, i) => (
                !it.disabled ?
                <div key={i} className="cmenu__item" onClick={(e) => {
                  e.preventDefault();
                  it.func();
                  hideContextMenu()
                  }}>
                  <div className="cmenu__action" >
                    {it.desc}
                  </div>
                  <div className="cmenu__shortcut" >
                    {it.shortcut}
                  </div>
                </div>
                :
                ""
              ))
            }
          </div>
        )
      }
    }
    
    </CollectionConsumer>
  );
}

export default ContextMenu;
