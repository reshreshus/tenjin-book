import React, {useState} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
         enabeEditable, removeSelections, 
         openContextMenu, hideContextMenu } from './domHelpers'
import { GET_CARD, SAVE_CARD, GET_BLOCKS, SAVE_BLOCKS, ADD_CARD, RENAME_BLOCK, DELETE_BLOCK } from './queries';
import { useMutation, useQuery } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(null) 
    // TODO
    const [blocksNumber, updateBlocksNumber] = useState(6);
    const [selectedBlockId, updateSelectedBlockId] = useState('');
    

    const [contextBlock, updateContextBlock] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);

    const {data: blocksData, loading: blocksLoading, error: blocksError} = useQuery(GET_BLOCKS,
        {
            onCompleted:  () => { console.log(blocksData.blocks); updateBlocks(blocksData.blocks) }
        });

    const [getCardQuery] = useMutation(GET_CARD);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);

    const [saveCardQuery] = useMutation(SAVE_CARD)
    const [saveBlocksQuery] = useMutation(SAVE_BLOCKS);

    const [addCardQuery] = useMutation(ADD_CARD);

    const [renameBlockQuery] = useMutation(RENAME_BLOCK);
    const [deleteBlockQuery] = useMutation(DELETE_BLOCK);
    //     , 
    //     {
    //     refetchQueries: [{
    //         query: GET_BLOCKS
    //     }]
    // });

    

    const [card, updateCard] = useState(null);

    const updateBlockName = (blockId) => {
        console.log("updateBlockName")
    }

    const deleteBlock = (blockPath) => {
        console.log("deleteBlock", blockPath);
        if (blockPath && blockPath.length > 1) {
            console.log("deleteBlock");
            deleteBlockQuery({
                variables: {path: blockPath}
            }).then((data) => {
                updateBlocks(data.data.deleteBlock);
            })
        } else {
            alert("Something is wrong. Probably can't delete root element");
        }
        
    }

    const renameBlock = (newName, blockPath) => {
        console.log("renameBlock", newName);
        renameBlockQuery({variables: {
            path: blockPath,
            newName: newName
        }}).then(data => {
            console.log("renameCard data", data)
        })
    }

    const findLastDeck = (block) => {
        // base case
        if (block.type === 'D') {
            return block;
        }
        // go from root to card to find the last block which is deck
        let currentBlock = blocks[0]
        let lastDeck = blocks[0]
        for (let i = 1; i < block.path.length; i++) {
            if (currentBlock.children) {
                // console.log("currentBlock", currentBlock, "block.path[i]", block.path[i] );
                let newBlock = currentBlock.children.filter(c => c.idx === block.path[i] )[0]
                if (newBlock.type === 'D'){
                    lastDeck = newBlock;
                }
                currentBlock = newBlock;
            } else break;
        }
        return lastDeck;
    }

    const addCard = (block) => {
        const newCardBlock = {
            idx: block.children ? block.children.length : 0,
            "name": "New Card",
            "type": "f",
            "path": [...block.path, block.idx],
        }
        
        addCardQuery().then((data) => {
            let cardId = data.data.addCard.id;
            newCardBlock.id = cardId;
            if (block.children) {
                block.children.push(newCardBlock);
            } else {
                block.children = [newCardBlock];
            }
            block.expanded =  true;
            
            
            blocks[0].count+=1;
            // TODO: can optimize
            saveBlocksQuery({
                variables: {"newBlocks": blocks}
            }).then((data) => {
                console.log("saveBlocks data", data)
            })
            updateBlocks([...blocks]);
        })
    }

    const addNewTopic = (block) => {
        const newTopic = {
            "id": String(blocks[0].count),
            idx: block.children ? block.children.length : 0,
            "name": "New Topic",
            "type": "T",
            "path": [...block.path, block.idx],
        }
        if (block.children) {
            block.children.push(newTopic)
        } else {
            block.children = [newTopic];
        }
        block.expanded =  true;
        blocks[0].count+=1;
        console.log(blocks);
        updateBlocks([...blocks]);
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
            entry_type:"C",
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
        console.log("chooseType Context")
    }

    const getBlock = (id) => {
        return blocks.filter (d => d.id === id)[0]
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
            selectBlockToRename(newBlocksNumber);
            updateBlocksNumber(blocksNumber + 1)
            
        } else {
            console.log("this kind of adding not implemented yet")
        }
    }

    const getCard = (id) => {
        updateIsCardUpdating(true);
        getCardQuery({
            variables: {id: id}
        }).then((data) => {
            // console.log("cardData", data)
            let newCard = data.data.card;
            updateCard(newCard);
            updateIsCardUpdating(false);
            return newCard;
        });        
    }

    return (
        <Collection.Provider value={{
                blocks,
                getBlock,
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
                card,
                isCardUpdating,
                saveCardServer,
                updateContextBlock,

                addNewTopic,
                findLastDeck,
                addCard,
                renameBlock,
                selectBlockToRename,
                deleteBlock
        }}>
            {children}
            <ContextMenu block={contextBlock} />
            <HotkeyApp selectedBlockId={selectedBlockId} showSidebars={showSidebars}
             updateShowSidebars={updateShowSidebars}/>
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};