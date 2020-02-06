const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

let blocks = {
    rootId: "0",
    items: {
        "0": {
            hasChildren: true,
            children: ["1", "2", "3"],
            isExpanded: true,
            parentID:  null,
            data: {
                name: "root",
                count: 6,
                type: "R",
            }
        },
        "1": {
            hasChildren: true,
            children: ["4", "_0"],
            isExpanded: true,
            parentID:  "0",
            data: {
                name: "English",
                type: "D",
            }
        },
        "4": {
            hasChildren: true,
            children: ["5"],
            isExpanded: false,
            parentID:  "1",
            data: {
                name: "Witcher 3",
                type: "D", 
            }
        },
        "5": {
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentID:  "4",
            data: {
                name: "The Last Wish",
                type: "D"
            }
        },
        "_0": {
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentID:  "1",
            data: {
                name: "a flashcard",
                type: "f"
            }

        },
        "2": {
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentID:  "0",
            data: {
                name: "Math",
                type: "D",
            }
        },
        "3": {
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentID:  "0",
            data: {
                name: "Programming",
                type: "D",
            }
        }
    }
}

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
        }
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

    type BlockData {
        name: "Math"
        type: "D"
    }

    type Block {
        hasChildren: Boolean
        children: [String]
        isExpanded: Boolean
        parentID: String
        data: BlockData
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
            newBlocks: JSON
        ): JSON,
        renameBlock (
            id: String
            newName: String
        ): Block,
        deleteBlock (id: String): JSON,
        duplicateBlock (id: String): JSON
    }

`;

const findBlock = (path) => {
    let currentBlock = blocks[0]
    for (let i = 1; i < path.length; i++) {
        // console.log("current block", currentBlock);
        if (currentBlock.children) {
            currentBlock = currentBlock.children.filter(c => c.idx === path[i])[0]
        } else {
            console.error("Couldn't find a block");
            return {}
        }
    }
    return currentBlock;
}
const ID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

const duplicateBlockRec = (parent, childIdx) => {
    let child = parent.children.filter(c => c.idx === childIdx)[0];
    if (!child) {
        console.error("Didn't find a child")
        return;
    }
    // TODO child's array's idx != childIdx ~ ambigious
    let idx = parent.children.indexOf(child);
    let duplicate = Object.assign({}, child);
    
    duplicate.name = `${duplicate.name} (duplicate)`
    duplicate.id = String(blocks[0].count); 
    duplicate.idx = blocks[0].count;
    blocks[0].count++;
    // shift other objects' (not array's) indexes
    // parent.children.map(c => {
    //     if (c.idx >= duplicate.idx) {
    //         c.idx++;
    //     }
    // })
    delete duplicate.children
    
    
    parent.children.splice(idx + 1, 0, duplicate); 
    // duplicate card
    if (duplicate.type === 'f') {
        let card = cards.filter(c => c.id === child.id)[0];
        let newCard = Object.assign({}, card);
        newCard.id = `_${ID()}`
        duplicate.id = newCard.id;
        idx = cards.indexOf(card);
        cards.splice(idx + 1, 0, newCard)
    }
    // TODO option to duplicate children
    // OMG
    // it has to be recursive now
}


// TODO: no error checking here
const resolvers = {  
    JSON: GraphQLJSON, 
    Query: {   
        cards: () => cards,
        blocks: () => blocks
    },
    Mutation: {
        addCardEntry: (parent, { id, name, content, entry_type, card_id}) => {
            const card = _.find(cards, {id: card_id})
            card.entries.push({    
                name,
                content,
                entry_type,
                id
            })
            return card.entries;
        },
        addCard: (parent, args) => {
            let card = Object.assign({}, newCard);
            card.id = `_${ID()}`; 
            cards = [...cards, card]  
            return card;
        },
        card: (parent, { id }) => {
                return _.find(cards, {id: id})
        },
        saveCard: (parent, {id, template_title, entries}) => {
            let card = _.find(cards, {id: id});
            let idx = cards.indexOf(card);
            card = {
                id, 
                template_title, 
                entries
            }
            cards[idx] = card;
            return card;
        },
        saveBlocks: (parent, {newBlocks}) => {
            // console.log("newBlocks", newBlocks);
            blocks = newBlocks;
            return blocks;
        },
        renameBlock: (parent, {id, newName}) => {
            // console.log("renameBlock newName", newName);
            blocks.items[id].data.name = newName;
        },
        deleteBlock: (_, {id}) => {           
            let block = delete blocks.items[id];
            let parent = blocks.items[block.parentID]
            let idx = parent.children.indexOf(id);
            parent.children.splice(idx, 1);
            return blocks;
        },
        duplicateBlock: (_, {id}) => {
            let block = blocks.items[id];
            let newBlock = Object.assign({}, block);
            newBlock.id = ID();
            let parent = blocks.items[newBlock.parentID]
            let idx = parent.children.indexOf(block);
            parent.children.splice(idx + 1, 0, newBlock);
            return blocks;
        }
    }
};

// export const jsSchema = makeExecutableSchema({ typeDefs, resolvers });
export const server = new ApolloServer({ cors: {
            origin: '*'}			// <- allow request from all domains
            // credentials: true}		// <- enable CORS response for requests with credentials (cookies, http authentication)
    , typeDefs, resolvers });