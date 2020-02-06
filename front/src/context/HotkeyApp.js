import React, {useState} from 'react';
import Hotkeys from 'react-hot-keys';
import {CollectionConsumer} from '../context/CollectionContext';


import { enabeEditable, selectElementContents, hideContextMenu} from './domHelpers';


const HotkeyApp = () => {
    const [sidebarLength, updateSidebarLength] = useState(null)
    return (
        <CollectionConsumer> 
        {
            ({selectedBlockId, showSidebars, updateShowSidebars, 
                contextBlock, deleteBlock, addCard, duplicateBlock,
                toggleCollapse}) => {

                const toggleCollapseHot = () => {
                    toggleCollapse(contextBlock);
                }

                const addCardHot = () => {
                    console.log("addCardHot");
                    if (selectedBlockId) {
                        addCard(contextBlock);
                    }
                }
            
                const chooseBlockToRename = (event, selectedBlockId) => {
                    // Prevent the default refresh event under WINDOWS system
                    console.log("handleF2");
                    if (selectedBlockId !== '') {
                        event.preventDefault();
                        let el = document.querySelector(`.block-${selectedBlockId}`);
                        enabeEditable(el)
                        selectElementContents(el);
                    }
                }
            
                const toggleLeftSidebar = () => {
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
            
                const toggleRightSidebar = () => {
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
            
                const deleteBlockHot = (event, selectedBlockId) => {
                    console.log("handleDel");
                    if (selectedBlockId) {
                        event.preventDefault();
                        deleteBlock(block.id);
                    }
                }
            
                const duplicateBlockHot = () => {
                    duplicateBlock(block.id);
                }
            
                const onKeyDown = (keyName, e, handle) => {
                    console.log("test:onKeyDown", keyName);
                    e.preventDefault();
                    switch (keyName) {
                        case 'f2':
                            chooseBlockToRename(e, selectedBlockId);
                            break;
                        case 'esc':
                            hideContextMenu();
                            break;
                        case 'alt+c':
                            toggleLeftSidebar();
                            break;
                        case 'alt+v':
                            toggleRightSidebar();
                            break;
                        case 'del':
                            deleteBlockHot(e, selectedBlockId);
                            break;
                        case 'a':
                            addCardHot();
                            break;
                        case 'ctrl+shift+d':
                            duplicateBlockHot();
                            break;
                        case 'z':
                            toggleCollapseHot();
                        default:
                            console.log("")
                    }
                }

                
                return (
                    <Hotkeys 
                        keyName="a,z,ctrl+s,f2,esc,alt+c,alt+v,del,alt+n,ctrl+shift+d" 
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
