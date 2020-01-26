import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = ({block}) => {

    const menuItems = [
        {
            "action": "New Topic",
            "shortcut": "Alt + N",
            "onClick": () => {
                console.log("New Topic Click")
            }
        },
        {
            "action": "New Card",
            "shortcut": "A",
            "onClick": () => {
                console.log("New Topic Click")
            }
        },
        {
            "action": "Rename",
            "shortcut": "F2",
            "onClick": () => {
                console.log("New Topic Click")
            }
        },
        {
            "action": "Duplicate",
            "shortcut": "Ctrl + D",
            "onClick": () => {
                console.log("New Topic Click")
            }
        },
        {
            "action": "Delete",
            "shortcut": "delete",
            "onClick": () => {
                console.log("New Topic Click")
            }
        },

    ]
    
    

    return (
        <CollectionConsumer> 
        {
            ({hideContextMenu}) => {
                return (
                    // TODO doesn't leave the mouse if we didn't enter it first!
                    <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
                        <div className="cmenu__item" onClick={() => {}}>
                            <div className="cmenu__action" onClick={() => {}}>
                                New Topic
                            </div>
                            <div className="cmenu__shortcut" onClick={() => {}}>
                                Alt + N
                            </div>
                        </div>
                    </div>
                )
            }
        }
        
        </CollectionConsumer>
    );
}

export default ContextMenu;
