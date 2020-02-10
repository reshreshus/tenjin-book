import React, {useState} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
         enabeEditable, removeSelections, 
         openContextMenu, hideContextMenu } from './domHelpers'
import { GET_CARD, SAVE_CARD, GET_BLOCKS, SAVE_BLOCKS, ADD_ITEM, 
    RENAME_BLOCK, DELETE_BLOCK, DUPLICATE_BLOCK } from './queries';
import { useMutation, useQuery } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(null) 
    // TODO
    const [selectedBlockId, updateSelectedBlockId] = useState('');
    

    const [contextBlock, updateContextBlock] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);

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

    const [card, updateCard] = useState(null);

    const updateBlockName = (blockId) => {
        console.log("updateBlockName")
    }

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
        })
    }

    const findLastDeck = (block) => {
        console.log("findLastDeck id", block.id);
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

    const addItem = (block, type) => {
        addItemQuery({
            variables: {type: type}
        }).then((data) => {
            console.log("add item data", data);
            let itemId = data.data.addItem.id;
            blocks.items[itemId] = {
                id: itemId,
                hasChildren: false,
                children: [],
                isExpanded: false,
                parentID: block.id,
                data: {
                    name: `New ${type} ${Object.keys(blocks.items).length}`,
                    type: type,
                }                
            }
            block.children.push(itemId);
            block.hasChildren = true;
            block.isExpanded = true;
            saveBlocks(blocks);
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

    const updateSelectedBlockIdAndCleanup = (id, blockRef) => {
        removeSelections();
        hideContextMenu();
        let el = blockRef.current.querySelector('.content-editable');
        disableEditable(el);
        updateSelectedBlockId(id);
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

    const deleteEntryContext = (entryID) => {
        let newCard = Object.assign({}, card);
        let newEntries = [...newCard.entries.filter((e => entryID !== e.id))];
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

    const selectBlockToRename = (blockId) => {
        hideContextMenu();
        updateSelectedBlockId(blockId)
        // new Block isn't created immediately so I wait
        setTimeout(() => {
            let el = document.querySelector(`.block-${blockId}`);
            enabeEditable(el)
            selectElementContents(el);
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
                deleteEntryContext,
                chooseTypeC,
                selectedBlockId,
                updateSelectedBlockIdAndCleanup,
                updateSelectedBlockId,
                getCard,
                updateBlockName,
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
                selectBlockToRename,
                deleteBlock,
                toggleExpanded,
                duplicateBlock,
                toggleCollapse,
                contextBlock,
                saveBlocks
        }}>
            {children}
            <ContextMenu block={contextBlock} />
            <HotkeyApp />
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};