import React, {useState} from 'react'
import hotkeys from 'hotkeys-js';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
    enabeEditable, removeSelections, hideContextMenu } from './helpers'
import { blocks_import, cards_import } from './defaultData';

import { handleHotkeysExternal } from './hotkeys.js';

import { GET_CARD } from './queries';
import { useLazyQuery } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(blocks_import)
    const [cards, updateCards] = useState(cards_import);    
    // TODO
    const [blocksNumber, updateBlocksNumber] = useState(6);
    const [selectedBlockId, updateSelectedBlockId] = useState('');

    const [contextBlock, updateContextBlock] = useState(null);


    const handleHotkeys = (event, handler) => {
        handleHotkeysExternal(event, handler, selectedBlockId);
    }

    // TODO the more your rename the more it is being exectued
    // Strange
    hotkeys('f2,esc', handleHotkeys);


    const updateBlockName = (blockId) => {
        console.log("updateBlockName")
    }


    const updateSelectedBlockIdAndCleanup = (id, blockRef) => {
        removeSelections();
        hideContextMenu();
        let el = blockRef.current.querySelector('.content-editable');
        disableEditable(el);
        updateSelectedBlockId(id);
    }

    const updateCardEntries = (cardId, changes) => {
        console.log("card is updating (supposedly)", changes)
    }

    

    const addNewEntryContext = (cardId) => {
        let card = cards.filter(c => c.id === cardId)[0];
        // TODO: might be slow?
        let idx = cards.indexOf(card)
        card.entries = [...card.entries, {
            entry_id: card.entries.length,
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "new entry" }
                }]
            },
            entry_type: "A",
            entry_name: "Back",
        }]
        let newCards = cards
        newCards[idx] = card;
        updateCards([...newCards]);
    }

    const deleteEntryContext = (cardId, entryId) => {
        let card = cards.filter(c => c.id === cardId)[0];
        let idx = cards.indexOf(card);
        card.entries.splice(entryId, 1)
        card.entries.map((e) => {
            if (e.entry_id > entryId) {
                e.entry_id--;
            }
        })
        let newCards = cards;
        newCards[idx] = card;
        updateCards([...newCards]);
    }

    const chooseTypeC = (cardId, entryId, type) => {
        console.log("chooseType Context")
    }

    const getBlock = (id) => {
        return blocks.filter (d => d.id === id)[0]
    }

    const addNewBlock = (previousBlockId = -1, isParent=false) => {
        let newBlocksNumber = String(blocksNumber + 1);
        if (previousBlockId < 0) {
            blocks.push({
                "id": String(newBlocksNumber),
                "name": "New Deck",
                "type": "D",
            })
             // edit new block immediately upon creating it
            updateBlocks([...blocks]);
            hideContextMenu();
            updateSelectedBlockId(newBlocksNumber)
            // new Block isn't created immediately so I wait
            setTimeout(() => {
                let el = document.querySelector(`.block-${newBlocksNumber}`);
                enabeEditable(el)
                selectElementContents(el);
            }, 100);
            updateBlocksNumber(blocksNumber + 1)
            
        } else {
            console.log("this kind of adding not implemented yet")
        }
    }

    const openContextMenu = (e, block) => {
        e.preventDefault();
        let menu = document.querySelector('.cmenu')
        updateContextBlock(block);
        
        menu.style.top = `${e.clientY + 10}px`;
        menu.style.left = `${e.clientX - 30}px`;
        menu.classList.remove('hide');
    }

    

    const getCard = () => {
        console.log("getCard")
    }

    return (
        <Collection.Provider value={{
                cards,
                blocks,
                getBlock,
                updateCardEntries,
                addNewEntryContext,
                deleteEntryContext,
                chooseTypeC,
                selectedBlockId,
                updateSelectedBlockIdAndCleanup,
                updateSelectedBlockId,
                addNewBlock,
                getCard,
                updateBlockName,
                openContextMenu,
                hideContextMenu
        }}>
            {children}
            <ContextMenu block={contextBlock} />
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};