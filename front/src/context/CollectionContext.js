import React, {useState, useEffect} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';

import { GET_BLOCKS} from '../api/queries';
import { useQuery } from '@apollo/react-hooks';

import { selectElementContents, removeSelections, 
         openContextMenu, hideContextMenu } from '../helpers/domHelpers'
import {getContextMutations} from './ContextMutations';


const Collection = React.createContext();

function CollectionProvider({children, 
    duplicateBlock, 
    deleteBlock,
    addDeck,
    addItem,
    saveCard,
    renameBlock,
    getCard,
    saveBlocks}) 
    {
    // console.error("getCard", getCard)
    const [blocks, updateBlocks] = useState(null) 
    const [contextBlock, updateContextBlock] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);
    const [isEditing, updateIsEditing] = useState(false);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);
    const [card, updateCard] = useState(null);

    const {data: blocksData, loading: blocksLoading, error: blocksError} = useQuery(GET_BLOCKS,
        {
            // TODO: query executes an unusual number of times
            onCompleted:  () => { 
                console.log(blocksData.blocks); 
                updateBlocks(blocksData.blocks) }
        });

    const findLastDeck = (block) => {
        // base case
        if (block.data.type === 'D') {
            return block;
        }

        let parent = blocks.items[block.parentId];
        if (!parent) {
            console.error("couldn't find a parent");
            return;
        }
        // if (parent.data.type === 'D') return parent
        return findLastDeck(parent);
    }

    const toggleExpanded = (blockId) => {
        let block = blocks.items[blockId];
        block.isExpanded = !block.isExpanded;
        console.log("toggleExpanded block", block);
        updateBlocks(Object.assign({}, blocks))
    }

    const updateContextBlockAndCleanup = (block, blockRef) => {
        removeSelections();
        hideContextMenu();
        updateContextBlock(Object.assign({}, block));
    }

    const addNewEntryContext = () => {
        let newCard = Object.assign({}, card)
        let newId = Math.max.apply(Math, card.entries.map(e => e.id)) + 1;
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
        updateCard(newCard)
    }

    const deleteEntryContext = (entryID) => {
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

    const saveBlocksContext = async (newBlocks) => {
        saveBlocks(newBlocks);
        updateBlocks(newBlocks);
    }

    const duplicateBlockContext = async (blockId) => {
        let blocks = await duplicateBlock(blockId);
        updateBlocks(blocks);
    }

    const deleteBlockContext = async (blockId) => {
        let blocks = await deleteBlock(blockId);
        updateBlocks(blocks);
    }

    const renameBlockContext = async (newName, blockId) => {
        updateCard(null);
        renameBlock(newName, blockId, updateBlocks);
        blocks.items[blockId].data.name = newName;     
        updateBlocks(Object.assign({}, blocks));
    }

    const addDeckContext = async (parentId) => {
        if (blocks.items[parentId].data.type !== 'D') {
            alert('Cannot make a deck from this type of item');
            return;
        }
        let newBlocks = await addDeck(parentId);
        updateBlocks(newBlocks);
    }

    const addItemContext = async (block, type) => {
        console.error("addItemContext");
        if (block.data.type !== 'D') {
            alert('Cannot make an item from this type of item');
            return;
        }
        updateBlocks(await addItem(block.id, type));
    }

    const saveCardContext = (savedCard) => {
        updateCard(savedCard);
        saveCard(savedCard);
    }

    const getCardContext = async (id) => {
        updateIsCardUpdating(true);
        let newCard = await getCard(id);
        console.error("NEW CARD", newCard)
        updateCard(newCard);
        updateIsCardUpdating(false);
    }

    const menuItems = getContextMutations(
        addDeckContext, 
        addItemContext, 
        selectBlockToRenameContext,
        duplicateBlockContext,
        deleteBlockContext,
        toggleExpanded,
        contextBlock
    );

    return (
    <Collection.Provider value={{
            blocks,
            addNewEntryContext,
            deleteEntryContext,
            chooseTypeC,
            updateContextBlockAndCleanup,
            getCardContext,
            openContextMenu,
            hideContextMenu,
            card,
            isCardUpdating,
            saveCardContext,
            updateContextBlock,
            showSidebars, 
            updateShowSidebars,
            blocks,
            updateBlocks,
            findLastDeck,
            contextBlock,
            isEditing, 
            updateIsEditing,
            selectBlockToRenameContext,
            renameBlockContext,
            menuItems,
            saveBlocksContext
        }}>
            {children}
            <ContextMenu />
            <HotkeyApp />
    </Collection.Provider>)
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};