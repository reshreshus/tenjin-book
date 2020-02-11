const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

let blocks = {
    rootId: "0",
    items: {
        "0": {
            id: "0",
            hasChildren: true,
            children: ["1", "2", "3"],
            isExpanded: true,
            parentID:  null,
            data: {
                name: "root",
                count: 6,
                type: "D",
            }
        },
        "1": {
            id: "1",
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
            id: "4",
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
            id: "5",
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
            id: "_0",
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
            id: "2",
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
            id: "3",
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
            type: "Q",
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
            type: "A",
        }
    ]
}

const newTopic = {
    template_id: "from db",
    template_title: "Basic Topic",
    entries: [
        {  
            id: 0,
            name: "Custom field",
            type: "C",
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            } 
        }
    ]
}

const newDeckBlock = {
    hasChildren: false,
    children: [],
    isExpanded: false
}

let items = [{
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
            type: "Q",
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
            type: "A",
        },
        
    ]
}]


const typeDefs = `
    scalar JSON

    type BlockData {
        name: String
        type: String
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
        type: String
    }

    type Query {
        items: [Card],
        blocks: JSON,
        cardEntry(id: ID): CardEntry
    }

    type Mutation {
        addCardEntry (
            name: String
            content: JSON
            type: String
            card_id: ID
            id: ID
        ): [CardEntry],
        card(id: ID): Card,
        saveCard (
            id: ID
            template_title: String
            entries: [JSON]
        ): Card,
        addItem(type: String): Card,
        saveBlocks (
            newBlocks: JSON
        ): JSON,
        renameBlock (
            id: String
            newName: String
        ): Block,
        deleteBlock (id: String): JSON,
        duplicateBlock (id: String): JSON,
        addDeck (
            parentID: String
        ): JSON
    }

`;

const ID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };




// TODO: no error checking here
const resolvers = {  
    JSON: GraphQLJSON, 
    Query: {   
        items: () => items,
        blocks: () => blocks
    },
    Mutation: {
        addDeck: (parent, {parentID}) => {
            let block = Object.assign({}, newDeckBlock);
            let id = ID();
            block.id = id;
            block.parentID = parentID;
            block.data = {
                type: 'D',
                name: `deck ${id}`
            }
            blocks.items[parentID].children.push(id);
            blocks.items[parentID].hasChildren = true;
            blocks.items[parentID].isExpanded = true;
            blocks.items[id] = block;
            return blocks;
        },
        addCardEntry: (parent, { id, name, content, type, card_id}) => {
            const card = _.find(items, {id: card_id})
            card.entries.push({    
                name,
                content,
                type,
                id
            })
            return card.entries;
        },
        addItem: (parent, {type}) => { 
            let item = type === 'f' ? Object.assign({}, newCard) : Object.assign({}, newTopic);
            item.id = `_${ID()}`; 
            items = [...items, item]  
            return item;
        },
        card: (parent, { id }) => { 
                return _.find(items, {id: id})
        },
        saveCard: (parent, {id, template_title, entries}) => {
            let card = _.find(items, {id: id});
            let idx = items.indexOf(card);
            card = {
                id, 
                template_title, 
                entries
            } 
            items[idx] = card;
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
            return blocks.items[id];
        },
        deleteBlock: (_, {id}) => {           
            let block = blocks.items[id];
            delete blocks.items[id];
            console.log("deleted block", block);
            let parent = blocks.items[block.parentID]
            let idx = parent.children.indexOf(id);
            parent.children.splice(idx, 1); 
            if (parent.children.length === 0) {
                parent.hasChildren = false;
            }
            return blocks;
        },
        duplicateBlock: (_, {id}) => {
            let block = blocks.items[id];
            let newBlock = Object.assign({}, block);
            let newId = ID();
            newBlock.children = []
            newBlock.id = newId;
            newBlock.hasChildren = false;
            newBlock.data.name = `${newBlock.data.name} (dupl)`
            let parent = blocks.items[newBlock.parentID]
            let idx = parent.children.indexOf(id);
            parent.children.splice(idx + 1, 0, newId);
            blocks.items[newId] = newBlock;
            // duplicate flashcard as well
            if (newBlock.data.type === 'f'){
                let card = Object.assign({}, items.filter(c => id === c.id)[0]);
                card.id = newId;
                items.push(card);
            }
            return blocks;
        }
    }
};

// export const jsSchema = makeExecutableSchema({ typeDefs, resolvers });
export const server = new ApolloServer({ cors: {
            origin: '*'}			// <- allow request from all domains
            // credentials: true}		// <- enable CORS response for requests with credentials (cookies, http authentication)
    , typeDefs, resolvers });