import React from 'react';
import Hotkeys from 'react-hot-keys';


const HotkeysEditor = ({saveCard}) => {
    return (
        <Hotkeys 
            keyName="ctrl+s" 
            onKeyDown={(keyName, e, handle) => { e.preventDefault(); saveCard()}}
        >
      </Hotkeys>
    );
}

export default HotkeysEditor;
