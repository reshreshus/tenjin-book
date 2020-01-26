import React from 'react';
import {CollectionConsumer} from '../context/CollectionContext';

const ContextMenu = () => {
    
    const hideContextMenu = (e) => {
        let menu = document.querySelector('.cmenu')
        menu.classList.add('hide');
        menu.style.top = '-200%';
        menu.style.left = '-200%';
    }
    return (
        <CollectionConsumer> 
        {
            (value) => {
                return (
                    <div className="cmenu hide" onMouseLeave={(e) => hideContextMenu(e)}>
                        <div className="cmenu_item" onClick={() => {}}>
                            I AM context menu
                        </div>
                    </div>
                )
            }
        }
        
        </CollectionConsumer>
    );
}

export default ContextMenu;
