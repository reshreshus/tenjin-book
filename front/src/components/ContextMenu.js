import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = ({block}) => {

    const menuItems = block ? [
        {
            "action": "New Topic",
            "shortcut": "Alt + N",
            "onClick": () => {
                console.log("New Topic Click")
            },
            "usable": block.type !== 'f' ? true : false
        },
        {
            "action": "New Card",
            "shortcut": "A",
            "onClick": () => {
                console.log("New Topic Click")
            },
            "usable": true
        },
        {
            "action": "Rename",
            "shortcut": "F2",
            "onClick": () => {
                console.log("New Topic Click")
            },
            "usable": true
        },
        {
            "action": "Duplicate",
            "shortcut": "Ctrl + D",
            "onClick": () => {
                console.log("New Topic Click")
            },
            "usable": true
        },
        {
            "action": "Delete",
            "shortcut": "delete",
            "onClick": () => {
                console.log("New Topic Click")
            },
            "usable": true
        },

    ] : []
    
    

    return (
        <CollectionConsumer> 
        {
            ({hideContextMenu}) => {
                return (
                    // TODO doesn't leave the mouse if we didn't enter it first!
                    <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
                        {
                            menuItems.map((it) => (
                                <div className="cmenu__item" onClick={() => {it.onClick()}}>
                                    <div className="cmenu__action" >
                                        {it.action}
                                    </div>
                                    <div className="cmenu__shortcut" >
                                        {it.shortcut}
                                    </div>
                                </div>
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
