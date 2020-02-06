import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = ({block}) => {

    return (
        <CollectionConsumer> 
        {
            ({hideContextMenu, addNewTopic, addCard, selectBlockToRename, 
                deleteBlock, duplicateBlock, toggleCollapse}) => {
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
                            // TODO rename after hitting enter
                            selectBlockToRename(block.id);
                        },
                        "usable": true
                    },
                    {
                        "action": "Duplicate",
                        "shortcut": "Ctrl + Shift + D",
                        "onClick": () => {
                            console.log("Duplicate");
                            duplicateBlock(block.id)
                        },
                        "usable": true
                    },
                    {
                        "action": "Delete",
                        "shortcut": "delete",
                        "onClick": () => {
                            console.log("Delete")
                            deleteBlock(block.id);
                        },
                        "usable": true
                    },
                    {
                        "action": "Toggle Collapsedness",
                        "shortcut": "Z",
                        "onClick": () => {
                            console.log("Toggle Collapsedness");
                            toggleCollapse(block);
                        },
                        "usable": true
                    },
                    {
                        "action": "Collapse All",
                        "shortcut": "Ctrl+Z",
                        "onClick": () => {
                            console.log("Toggle Collapsedness")
                        },
                        "usable": true
                    },

            
                ] : []

                return (
                    // TODO doesn't leave the mouse if we didn't enter it first!
                    <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
                        {
                            menuItems.map((it, i) => (
                                <div key={i} className="cmenu__item" onClick={() => {it.onClick(); hideContextMenu()}}>
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
