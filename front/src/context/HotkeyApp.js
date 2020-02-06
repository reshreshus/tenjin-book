import React, {useState} from 'react';
import Hotkeys from 'react-hot-keys';

import { enabeEditable, selectElementContents, hideContextMenu} from './domHelpers';


const HotkeyApp = ({selectedBlockId, showSidebars, updateShowSidebars, 
    block, deleteBlock}) => {
    const [sidebarLength, updateSidebarLength] = useState(null);

    const handleF2 = (event, selectedBlockId) => {
        // Prevent the default refresh event under WINDOWS system
        console.log("handleF2");
        if (selectedBlockId !== '') {
            event.preventDefault();
            let el = document.querySelector(`.block-${selectedBlockId}`);
            enabeEditable(el)
            selectElementContents(el);
        }
    }

    const handleAltC = () => {
        let sidebar = document.querySelector('.sidebar');
        console.log("handleAltC", sidebar);
        // both sidebars are on
        // switch left sidebar off
        if (showSidebars[0] === true && showSidebars[1] == true) {
            sidebar.style.display = 'none';
            updateShowSidebars([false, true])
        // left sidebar is off
        // switch it on
        } else if (showSidebars[0] === false && showSidebars[1] === true) {
            // sidebar.style.width = sidebarLength;
            sidebar.style.display = 'inline';
            updateShowSidebars([true, true])
        } else {
            // don't react
        }
    }

    const handleAltV = () => {
        console.log("hadnleAltV")
        let sidebar = document.querySelector('.sidebar');
        let rightSidebar = document.querySelector('.right-sidebar');
        // both sidebars are on
        // switch right sidebar off
        if (showSidebars[0] === true && showSidebars[1] == true) {
            updateSidebarLength(sidebar.clientWidth)
            rightSidebar.style.display = 'none';
            updateShowSidebars([true, false])
            sidebar.style.width = '100%';
        // right sidebar is off
        // switch it on
        } else if (showSidebars[0] === true && showSidebars[1] === false) {
            console.log("sidebarLength", sidebarLength);
            sidebar.style.width = `${sidebarLength}px`;
            rightSidebar.style.display = 'inline';
            updateShowSidebars([true, true]);
        } else {
            // don't react
        }
    }

    const handleDel = (event, selectedBlockId) => {
        console.log("handleDel");
        if (selectedBlockId) {
            event.preventDefault();
            deleteBlock([...block.path, block.idx]);
        }
    }

    const onKeyDown = (keyName, e, handle) => {
        console.log("test:onKeyDown", keyName);
        e.preventDefault();
        switch (keyName) {
            case 'f2':
                handleF2(e, selectedBlockId);
                break;
            case 'esc':
                hideContextMenu();
                break;
            case 'alt+c':
                handleAltC();
                break;
            case 'alt+v':
                handleAltV();
                break;
            case 'del':
                handleDel(e, selectedBlockId);
                break;
            default:
                console.log("")
        }
    }


    return (
        <Hotkeys 
            keyName="ctrl+s,f2,esc,alt+c,alt+v,del" 
            onKeyDown={(keyName, e, handle) => onKeyDown(keyName, e, handle)}
        >
      </Hotkeys>
    );
}

export default HotkeyApp;
