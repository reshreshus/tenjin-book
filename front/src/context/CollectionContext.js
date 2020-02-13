import React, {useState} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents,
    enableEditable, removeSelections, 
         openContextMenu, hideContextMenu } from '../helpers/domHelpers'
import { GET_CARD, SAVE_CARD, GET_BLOCKS, SAVE_BLOCKS, ADD_ITEM, 
    RENAME_BLOCK, DELETE_BLOCK, DUPLICATE_BLOCK, ADD_DECK } from '../api/queries';
import { useMutation, useQuery } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(null) 
    const [contextBlock, updateContextBlock] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);
    const [isEditing, updateIsEditing] = useState(false);

    const {data: blocksData, loading: blocksLoading, error: blocksError} = useQuery(GET_BLOCKS,
        {
            // TODO: query executes an unusual number of times
            onCompleted:  () => { 
                console.log(blocksData.blocks); 
                updateBlocks(blocksData.blocks) }
        });

    const [getCardQuery] = useMutation(GET_CARD);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);

    const [saveCardQuery] = useMutation(SAVE_CARD)
    const [saveBlocksQuery] = useMutation(SAVE_BLOCKS);

    const [addItemQuery] = useMutation(ADD_ITEM);

    const [renameBlockQuery] = useMutation(RENAME_BLOCK);
    const [deleteBlockQuery] = useMutation(DELETE_BLOCK);
    const [duplicateBlockQuery] = useMutation(DUPLICATE_BLOCK);
    const [addDeckQuery] = useMutation(ADD_DECK);

    const [card, updateCard] = useState(null);

    const toggleCollapse = (block) => {
        block.isExpanded = !block.isExpanded;
        updateBlocks(Object.assign({}, blocks));
    }

    const duplicateBlock = (blockId) => {
        duplicateBlockQuery({
            variables: {id: blockId}
        }).then(data => {
            console.log("duplicateBlockQuery", data.data.duplicateBlock);
            updateBlocks(data.data.duplicateBlock);
        })
    }

    const deleteBlock = (blockId) => {
        console.log("deleteBlock blockId", blockId);
        // if (blockPath && blockPath.length > 1) {
        console.log("deleteBlock");
        deleteBlockQuery({
            variables: {id: blockId}
        }).then((data) => {
            updateBlocks(data.data.deleteBlock);
        })
        // } else {
            // alert("Something is wrong. Probably can't delete root element");
        // }
        
    }

    const renameBlock = (newName, blockId) => {
        console.log("renameBlock", newName);
        renameBlockQuery({variables: {
            id: blockId,
            newName: newName
        }}).then(data => {
            console.log("renameCard data", data)
            updateCard(null);
            // TODO: not normalized
            blocks.items[blockId].data.name = newName;
            // blocks.items[blockId] = data.data.renameBlock;
            updateBlocks(Object.assign({}, blocks))
        })
    }

    const findLastDeck = (block) => {
        // base case
        if (block.data.type === 'D') {
            return block;
        }

        let parent = blocks.items[block.parentID];
        if (!parent) {
            console.error("couldn't find a parent");
            return;
        }
        // if (parent.data.type === 'D') return parent
        return findLastDeck(parent);
    }

    const addDeck = (parentID) => {
        if (blocks.items[parentID].data.type !== 'D') {
            alert('Cannot make a deck from this type of item');
            return;
        }
        console.log("addDeck");
        addDeckQuery({
            variables: {
                parentID
            }
        }).then(data => {
            console.log("addDeckQuery data", data);
            updateBlocks(data.data.addDeck);
        })
    }

    const addItem = (block, type) => {
        if (block.data.type !== 'D') {
            alert('Cannot make an item from this type of item');
            return;
        }
        addItemQuery({
            variables: {
                type,
                parentID: block.id
            }
        }).then((data) => {
            console.log("add item data", data);
            saveBlocks(data.data.addItem);
        })
    }

    const saveBlocks = (newBlocks) => {
        saveBlocksQuery({
            variables: {"newBlocks": newBlocks}
        }).then((data) => {
            console.log("saveBlocks data", data)
        })
        updateBlocks(Object.assign({}, newBlocks));
    }

    const toggleExpanded = (block) => {
        block.isExpanded = !block.isExpanded;
        updateBlocks(Object.assign({}, blocks))
    }

    const updateContextBlockAndCleanup = (block, blockRef) => {
        removeSelections();
        hideContextMenu();
        let el = blockRef.current.querySelector('.content-editable');
        // disableEditable(el);
        updateContextBlock(Object.assign({}, block));
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
        let newCard = Object.assign({}, card)
        let newId = Math.max.apply(Math, card.entries.map(e => e.id)) + 1;
        console.log("addNewEntryContext");
        let newEntry = {
            name:"New Entry", 
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            }, 
            type:"C",
            id: newId
        }
        
        newCard.entries.push(newEntry)
        console.log("newCard (add new entry)", newCard);
        updateCard(newCard)
    }

    const deleteEntryC = (entryID) => {
        let newCard = Object.assign({}, card);
        let newEntries = [...newCard.entries.filter((e => entryID !== e.id))];
        blocks.items[newCard.id].data.type =  'T';
        newEntries.map(e => {
            if (e.type === 'Q') {
                blocks.items[newCard.id].data.type = 'f';
            }
        });
        newCard.entries = newEntries;
        updateCard(newCard);
    }

    const chooseTypeC = (cardId, entryId, type) => {
        let newCard = Object.assign({}, card);
        let entry = newCard.entries.filter(e => e.id === entryId)[0]
        entry.type = type;
        blocks.items[cardId].data.type = 'T'
        newCard.entries.map(e => {
            if (e.type === 'Q') {
                blocks.items[cardId].data.type = 'f';
            }
        })
        updateBlocks(Object.assign({}, blocks));
        updateCard(newCard);
        
    }
    const selectBlockToRenameContext = () => {
        updateIsEditing(true);
        if (contextBlock) {
            let el = document.querySelector(`#block-${contextBlock.id}`);
            selectElementContents(el);
        }
    }

    //TODO: not tested
    const selectBlockToRenameAfterCreation = (block) => {
        updateIsEditing(true);
        updateContextBlock(block)
        // new Block isn't created immediately so I wait
        setTimeout(() => {
            selectBlockToRenameContext();
        }, 100);
    }

    const getCard = (id) => {
        updateIsCardUpdating(true);
        getCardQuery({
            variables: {id: id}
        }).then((data) => {
            console.log("cardData", data)
            let newCard = data.data.card;
            updateCard(newCard);
            updateIsCardUpdating(false);
            return newCard;
        });        
    }

    return (
        <Collection.Provider value={{
                blocks,
                addNewEntryContext,
                deleteEntryC,
                chooseTypeC,
                updateContextBlockAndCleanup,
                getCard,
                openContextMenu,
                hideContextMenu,
                card,
                isCardUpdating,
                saveCardServer,
                updateContextBlock,
                showSidebars, 
                updateShowSidebars,

                blocks,
                updateBlocks,
                findLastDeck,
                addItem,
                renameBlock,
                deleteBlock,
                toggleExpanded,
                duplicateBlock,
                toggleCollapse,
                contextBlock,
                saveBlocks,
                addDeck,
                isEditing, 
                updateIsEditing,
                selectBlockToRenameContext
        }}>
            {children}
            <ContextMenu block={contextBlock} />
            <HotkeyApp />
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};