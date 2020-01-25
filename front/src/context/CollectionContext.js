import React, {useState} from 'react'
import hotkeys from 'hotkeys-js';

const Collection = React.createContext();

const blocks_import = [
    {
        "id": "1",
        "idx": "1",
        "name": "English",
        "expanded": true,
        "type": "D",
        "deck": "root",
        "path": [],
        "children": [
            {
                "id": "4",
                "idx": "1",
                "deck": "1",
                "path": [1],
                "name": "Witcher 3",
                "type": "D",
                "expanded": false,
                "children": [
                    {
                        "id": "5",
                        "deck": "1",
                        "path": [1,1],
                        "idx": "1",
                        "name": "The Last Wish",
                        "type": "D",
                    }
                ]
            }, 
            {
                "idx": "2",
                "type": "f",
                "id": "_1",
                "name": "a flashcard"
            }
        ]
    },
    {
        "id": "2",
        "idx": "2",
        "name": "Math",
        "type": "D",
        "path": [],
    },
    {
        "id": "3",
        "idx": "3",
        "name": "Programming",
        "type": "D",
        "path": [],
    },
]

const cards_import = [{
    id: "_1",
    deck_id: "from db",
    // block_id: "from db",
    template_id: "from db",
    deck_title: "English",
    template_title: "Basic",
    entries: [
        {
            entry_id: 0,
            entry_name: "Front",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "probably some editorJs stuff or html" }
                }]
            },
            entry_type: "Q",
        },
        {
            entry_id: 1,
            entry_name: "Back",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "probably some editorJs stuff or html" }
                }]
            },
            entry_type: "A",
        },
        
    ]
}]

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(blocks_import)
    const [cards, updateCards] = useState(cards_import);
    const [isBlockEditing, updateIsBlockEditing] = useState(false)
    
    // TODO
    const [blocksNumber, updateBlocksNumber] = useState(5);
    const [selectedBlockId, updateSelectedBlockId] = useState('');

    const updateBlockName = (blockId) => {
        console.log("updateBlockName")
    }

    const updateSelectedBlockIdAndCleanup = (id, blockRef) => {
        if (selectedBlockId !== id || id === '') {
            let sel = window.getSelection();
            sel.removeAllRanges();
            let el = blockRef.current.querySelector('.content-editable')
            el.setAttribute('disabled', true);
            el.setAttribute('contenteditable', false);
        } 
        updateSelectedBlockId(id);
    }

    const selectElementContents = (el) => {
        let range;
        if (window.getSelection && document.createRange) {
            range = document.createRange();
            let sel = window.getSelection();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            
        } else if (document.body && document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    }

    hotkeys('f2', function(event, handler){
        // Prevent the default refresh event under WINDOWS system
        if (selectedBlockId !== '') {
            event.preventDefault();
            let el = event.target.querySelector("div");
            el.setAttribute('disabled', false);
            el.setAttribute('contenteditable', true);
            updateIsBlockEditing(true);
            selectElementContents(el);
        }
    });

    // hotkeys('enter, escape') {
        
    // }

    const updateCardEntries = (cardId, changes) => {
        console.log("card is updating (supposedly)", changes)
    }

    const getCard = (cardId) => {
        return cards.filter((c) => 
            c.id === cardId
            )[0]
    }

    const addNewEntryContext = (cardId) => {
        console.log("addNewEntryContext")
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
        if (previousBlockId < 0) {
            blocks.push({
                "id": String(blocksNumber),
                "name": "New Deck",
                "type": "D",
            })
            updateBlocks([...blocks]);
            updateBlocksNumber(blocksNumber + 1)
        } else {
            console.log("adding not implemented yet")
        }

    }

    return (
        <Collection.Provider value={{
                cards: cards,
                getCard: getCard,
                blocks: blocks,
                getBlock: getBlock,
                updateCardEntries,
                addNewEntryContext: addNewEntryContext,
                deleteEntryContext: deleteEntryContext,
                chooseTypeC: chooseTypeC,
                selectedBlockId,
                updateSelectedBlockIdAndCleanup,
                addNewBlock,
                isBlockEditing,
                getCard,
                updateBlockName
        }}>
            {children}
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

