import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = ({block}) => {

    return (
        <CollectionConsumer> 
        {
            ({hideContextMenu, addNewTopic, addCard}) => {
                const menuItems = block ? [
                    {
                        "action": "New Topic",
                        "shortcut": "Alt + N",
                        "onClick": () => {
                            console.log("New Topic");
                            addNewTopic(block);
                        },
                        "usable": block.type !== 'f' ? true : false
                    },
                    {
                        "action": "New Card",
                        "shortcut": "A",
                        "onClick": () => {
                            console.log("New New Card")
                            addCard(block);
                        },
                        "usable": true
                    },
                    {
                        "action": "Rename",
                        "shortcut": "F2",
                        "onClick": () => {
                            console.log("Rename")
                        },
                        "usable": true
                    },
                    {
                        "action": "Duplicate",
                        "shortcut": "Ctrl + D",
                        "onClick": () => {
                            console.log("Duplicate")
                        },
                        "usable": true
                    },
                    {
                        "action": "Delete",
                        "shortcut": "delete",
                        "onClick": () => {
                            console.log("Delete")
                        },
                        "usable": true
                    },
            
                ] : []

                return (
                    // TODO doesn't leave the mouse if we didn't enter it first!
                    <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
                        {
                            menuItems.map((it, i) => (
                                <div key={i} className="cmenu__item" onClick={() => {it.onClick()}}>
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
