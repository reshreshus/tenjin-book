import React, {useState} from 'react';
import Hotkeys from 'react-hot-keys';
import {CollectionConsumer} from '../context/CollectionContext';
import {hideContextMenu} from '../helpers/domHelpers';

const HotkeyApp = ({ menuItems, addItemHeaderDeck }) => {
  const [rightSidebarWidth, updateRightSidebarWidth] = useState(null)

  return (
    <CollectionConsumer>
    {
      ({ rightSidebarIsShown, updateRightSidebarIsShown, toggleLeftSidebar }) => {
        const openSidebarHalfFullWidth = () => {
          let sidebar = document.querySelector('.sidebar');
          const windowWidth = document.body.offsetWidth;
          console.log({windowWidth})
          sidebar.style.width = `${windowWidth}px`
        }

        const toggleRightSidebar = () => {
          let sidebar = document.querySelector('.sidebar');
          let rightSidebar = document.querySelector('.right-sidebar');
          if (rightSidebarIsShown) {
            updateRightSidebarWidth(sidebar.clientWidth)
            rightSidebar.style.display = 'none';
            updateRightSidebarIsShown(false);
            sidebar.style.width = '100%';
          } else {
            console.log("sidebarLength", rightSidebarWidth);
            sidebar.style.width = `${rightSidebarWidth}px`;
            rightSidebar.style.display = 'inline';
            updateRightSidebarIsShown(true);
          }
        }

        let hotkeys = menuItems.map(({hotkeyJs}) => hotkeyJs)
        hotkeys = [...hotkeys, 'alt+v', 'ctrl+b', 'ctrl+alt+h', 'esc', 'ctrl+alt+a']
        hotkeys = hotkeys.join(',')

        const onKeyDown = (keyName, e, handle) => {
          // TODO: add toggle on alt+c and alt+v
          // TODO and esc to close context menu
          switch(keyName) {
            case 'ctrl+alt+a':
              addItemHeaderDeck()
              break;
            case 'alt+v':
              toggleRightSidebar();
              e.preventDefault();
              break;
            case 'ctrl+b':
              toggleLeftSidebar();
              e.preventDefault();
              break;
            case 'ctrl+alt+h':
              openSidebarHalfFullWidth();
              break;
            case 'esc':
              hideContextMenu();
              e.preventDefault();
              break;
            default:
              menuItems.forEach(it => {
                if (keyName === it.hotkeyJs) {
                  e.preventDefault();
                  it.func();
                }
              })
          }
        }

        return (
          <Hotkeys
            keyName={hotkeys}
            onKeyDown={(keyName, e, handle) => onKeyDown(keyName, e, handle)}
          >
          </Hotkeys>
        )
      }
    }
     </CollectionConsumer>
  );
}

export default HotkeyApp;
