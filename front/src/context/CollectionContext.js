import React, {useState} from 'react'
import HotkeyApp from './Hotkeys';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
    enabeEditable, removeSelections, hideContextMenu } from './domHelpers'
import { blocks_import, cards_import } from './defaultData';

import {addNewEntryApi} from './api';

import { GET_CARD, ADD_CARD_ENTRY, SAVE_CARD } from './queries';
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
    

    const [getCardQuery] = useMutation(GET_CARD);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);

    const [saveCardQuery] = useMutation(SAVE_CARD)

        

    // console.log("getCardResponse", getCardResponse)
    const [card, updateCard] = useState(null);
    
    const [addCardEntryQuery, {data}] = useMutation(ADD_CARD_ENTRY)
    
    // if (getCardResponse.data && getCardResponse.data.card)
    //     updateCard(getCardResponse.data.card)


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

    const saveCardServer = (savedCard) => {
        updateCard(savedCard);
        console.log("saveCardServer entries", card.entries);
        // TODO: WTF I need to understand why this works
        // looks like saveCardQuery works with an old version of savedCard (or card in state)
        setTimeout(() => {
            saveCardQuery({
                variables: savedCard
            }).then((data) => {
                console.log("savecard data", data)
            })
        }, 100)
        
        
    }

    const addNewEntryContext = (cardId) => {
        console.log("cardId", cardId);
        let newEntry = {
            name:"New Entry", 
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            }, 
            entry_type:"C",
            id: card.entries.length
        }
        let newCard = Object.assign({}, card)
        newCard.entries.push(newEntry)
        updateCard(newCard)
        // used to save it to collection immediately
        // newEntry['card_id'] = cardId;
        // addCardEntryQuery({
        //     variables: newEntry
        // }).then((data) => {
        //     updateCard(card)
        // });
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
            let newCard = data.data.card;
            console.log("type of newCard.entries", typeof newCard.entries)
            updateCard(newCard);
            updateIsCardUpdating(false);
            return newCard;
        });
        
        // return cards.filter((c) => c.id === id )[0]
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
                isCardUpdating,
                saveCardServer
        }}>
            {children}
            <ContextMenu block={contextBlock} />
            <HotkeyApp selectedBlockId={selectedBlockId} />
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};