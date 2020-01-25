import React, {useState} from 'react'

const Collection = React.createContext();

const blocks_import = [
    {
        "id": "1",
        "name": "English",
        "expanded": true,
        "type": "D",
        "children": [
            {
                "id": "4",
                "name": "Witcher 3",
                "type": "D",
                "expanded": false,
                "children": [
                    {
                        "id": "5",
                        "name": "The Last Wish",
                        "type": "D",
                    }
                ]
            }, 
            {
                "type": "f",
                "id": "_1",
                "name": "a flashcard"
            }
        ]
    },
    {
        "id": "2",
        "name": "Math",
        "type": "D",
    },
    {
        "id": "3",
        "name": "Programming",
        "type": "D",
    },
]

const cards_import = [{
    id: "_1",
    deck_id: "from db",
    block_id: "from db",
    template_id: "from db",
    deck_title: "Enlish",
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

    // render () {
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
            }}>
                {children}
            </Collection.Provider>)
    // }
    
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

