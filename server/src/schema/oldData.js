let blocks = [
    {
        "id": "0",
        "idx": 0, 
        "name": "root",
        "count": 6,
        "expanded": true,
        "type": "R",
        "path": [],
        children: [
            {
                "id": "1",
                "idx": 0,
                "name": "English",
                "expanded": true,
                "type": "D",
                "path": [0],
                "children": [
                    {
                        "id": "4",
                        "idx": 0,
                        "deck": 1,
                        "path": [0, 0],
                        "name": "Witcher 3",
                        "type": "D", 
                        "expanded": false,
                        "children": [
                            {
                                "id": "5",
                                "deck": 1,
                                "path": [0, 0, 0],  
                                "idx": 0,
                                "name": "The Last Wish",
                                "type": "D",   
                            } 
                        ]    
                    }, 
                    {
                        "idx": 1,
                        "type": "f",
                        "id": "_0",
                        "name": "a flashcard", 
                        "path": [0, 0]
                    }
                ]
            },
            {
                "id": "2",
                "idx": 1,
                "name": "Math",
                "type": "D",
                "path": [0],
            },
            {
                "id": "3",
                "idx": 2,
                "name": "Programming",
                "type": "D",
                "path": [0],
            }
        ]
    }
]

const newCard = {
    template_id: "from db",
    template_title: "Basic",
    entries: [
        {  
            id: 0,
            name: "Front",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            },
            entry_type: "Q",
        },
        {
            id: 1,
            name: "Back",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            },   
            entry_type: "A",
        }, 
        // {
        //     id: 2,
        //     name: "Custom",
        //     content: {
        //         blocks: [{
        //             type: "paragraph",
        //             data: { text: "" }
        //         }]
        //     },   
        //     entry_type: "C",
        // },
        
    ]
}

let cards = [{
    id: "_0",
    template_id: "from db",
    deck_title: "English",
    template_title: "Basic",
    entries: [
        {
            id: 0,
            name: "Front",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "probably some editorJs stuff or html" }
                }]
            },
            entry_type: "Q",
        },
        {
            id: 1,
            name: "Back",
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


const typeDefs = `
    scalar JSON

    type Block {
        id: String
        idx: Int
        name: String
        expanded: Boolean
        type: String
        deck: String
        path: [Int]
        children: [Block] 
    }

    type Card {
        id: ID,
        template_id: String,
        template_title: String,
        entries: [CardEntry]
    }

    type CardEntry {
        id: Int,
        name: String,
        content: JSON, 
        template_title: String,
        entry_type: String
    }

    type Query {
        cards: [Card],
        blocks: [JSON],
        cardEntry(id: ID): CardEntry
    }

    type Mutation {
        addCardEntry (
            name: String
            content: JSON
            entry_type: String
            card_id: ID
            id: ID
        ): [CardEntry],
        card(id: ID): Card,
        saveCard (
            id: ID
            template_title: String
            entries: [JSON]
        ): Card,
        addCard: Card,
        saveBlocks (
            newBlocks: [JSON]
        ): [JSON],
        renameBlock (
            path: [Int]
            newName: String
        ): Block,
        deleteBlock (path: [Int]): [JSON],
        duplicateBlock (path: [Int]): [JSON]
    }

`;