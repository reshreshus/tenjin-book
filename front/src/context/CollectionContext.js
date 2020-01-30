import React, {useState} from 'react'
import hotkeys from 'hotkeys-js';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
    enabeEditable, removeSelections, hideContextMenu } from './domHelpers'
import { blocks_import, cards_import } from './defaultData';

import { handleHotkeysExternal } from './hotkeys.js';

import {addNewEntryApi} from './api';

import { GET_CARD, ADD_CARD_ENTRY } from './queries';
import { useQuery, useMutation } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(blocks_import)
    const [cards, updateCards] = useState(cards_import);    
    // TODO
    const [blocksNumber, updateBlocksNumber] = useState(6);
    const [selectedBlockId, updateSelectedBlockId] = useState('');

    const [contextBlock, updateContextBlock] = useState(null);
    const [cardId, updateCardId] = useState(null)
    

    const [getCardQuery, {data : cardData}] = useMutation(GET_CARD);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);
        

    // console.log("getCardResponse", getCardResponse)
    const [card, updateCard] = useState(null);
    
    const [addCardEntryQuery, {data}] = useMutation(ADD_CARD_ENTRY)
    
    // if (getCardResponse.data && getCardResponse.data.card)
    //     updateCard(getCardResponse.data.card)

    


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
        console.log("updateCardEntries")
       
        let newCard = Object.assign({}, card);
        newCard['test'] = 'test'
        updateCard(newCard);

    }

    

    const addNewEntryContext = (cardId) => {
        console.log("cardId", cardId);
        let newEntry = {
            name:"loh", 
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "new entry stuff" }
                }]
            }, 
            entry_type:"Q",
            // TODO doing the same thing in server. Need to duplicate?
            id: card.entries.length
        }
        // let card = cards.filter((c) => c.id === cardId)[0]
        card.entries.push(newEntry)
        updateCard(card)
        newEntry['card_id'] = cardId;
        addCardEntryQuery({
            variables: newEntry
        }).then((data) => {
            updateCard(card)
        });
        // updateCards([...cards]);
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

    

    const getCard = (id) => {
        updateIsCardUpdating(true);
        getCardQuery({
            variables: {id: id}
        }).then((data) => {
            console.log("cardData", data)
            updateCard(data.data.card);
            updateIsCardUpdating(false);
        });
        
        return cards.filter((c) => c.id === id )[0]
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
                hideContextMenu,
                updateCardId,
                card,
                isCardUpdating
        }}>
            {children}
            <ContextMenu block={contextBlock} />
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};