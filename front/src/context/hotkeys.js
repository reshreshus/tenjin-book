import React from 'react';
import Hotkeys from 'react-hot-keys';

import { enabeEditable, selectElementContents, hideContextMenu} from './domHelpers';

// export const handleHotkeysExternal = (event, handler, selectedBlockId) => {
    
// }



const HotkeyApp = ({selectedBlockId}) => {
    const onKeyUp = (keyName, e, handle) => {
        console.log("test:onKeyUp");
    }

    const handleF2 = (event, handler, selectedBlockId) => {
        // Prevent the default refresh event under WINDOWS system
        console.log("handleF2");
        if (selectedBlockId !== '') {
            event.preventDefault();
            let el = document.querySelector(`.block-${selectedBlockId}`);
            enabeEditable(el)
            selectElementContents(el);
        }
    }

    const onKeyDown = (keyName, e, handle) => {
        console.log("test:onKeyDown", keyName);
        e.preventDefault();
        switch (keyName) {
            case 'f2':
                handleF2(e, handle, selectedBlockId);
                break;
            case 'esc':
                hideContextMenu();
                break;
            default:
                console.log("")
        }
    }


    return (
        <Hotkeys 
            keyName="ctrl+s,f2,esc" 
            onKeyDown={(keyName, e, handle) => onKeyDown(keyName, e, handle)}
            onKeyUp={() => onKeyUp()}
        >
      </Hotkeys>
    );
}

export default HotkeyApp;
