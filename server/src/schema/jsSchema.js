const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

let blocks = {
    rootId: "-1",
    items: {
        "-1": {
            id: "-1",
            hasChildren: true,
            children: ["0"],
            isExpanded: true,
            data: {
                name: 'Root Tree (for atlaskit)'
            }
        },
        "0": {
            id: "0",
            hasChildren: true,
            children: ["1", "2", "3"],
            isExpanded: true,
            parentId:  null,
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
            parentId:  "0",
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
            parentId:  "1",
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
            parentId:  "4",
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
            parentId:  "1",
            data: {
                name: "a flashcard",
                type: "f",
                repetitionStatsSm2: {
                    eFactor: 2.5,
                    repetitionsCount: 0,
                    nextDate: '-1',
                    history: [repetitionStatsSm2: {
                        eFactor: 2.5,
                        repetitionsCount: 0,
                        nextDate: '-1',
                        history: [
                        ]
                    },
                    ]
                },
            },
        },
        "2": {
            id: "2",
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentId:  "0",
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
            parentId:  "0",
            data: {
                name: "Programming",
                type: "D",
            }
        }
    }
}

const newCard = {
    templateId: "from db",
    templateTitle: "Basic",
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
    templateId: "from db",
    templateTitle: "Basic Topic",
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
    templateId: "from db",
    templateTitle: "Basic",
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
        parentId: String
        data: BlockData
    }

    type RepetitionEvent {
        date: String!
        quality: Int!
    }

    type RepetitionStatsSm2 {
        eFactor: String!
        repetitionsCount: Int!
        nextDate: String!
        history: [RepetitionEvent]
    }

    type Card {
        id: ID,
        templateId: String,
        templateTitle: String,
        entries: [CardEntry],
        repetitionStatsSm2: RepetitionStatsSm2
    }

    type CardEntry {
        id: Int,
        name: String,
        content: JSON, 
        templateTitle: String,
        type: String
    }

    type Query {
        items: [Card],
        blocks: JSON,
        cardEntry(id: ID!): CardEntry
    }

    type Mutation {
        addCardEntry (
            name: String!
            content: JSON
            type: String!
            card_id: ID!
            id: ID!
        ): [CardEntry],
        card(id: ID!): Card,
        saveCard (
            id: ID!
            templateTitle: String!
            entries: [JSON]
        ): Card,
        addItem(
            type: String!
            parentId: String!
            ): JSON,
        saveBlocks (
            newBlocks: JSON
        ): JSON,
        renameBlock (
            id: String!
            newName: String!
        ): Block,
        deleteBlock (id: String!): JSON,
        duplicateBlock (id: String!): JSON,
        addDeck (
            parentId: String!
        ): JSON,
        advanceCard(
            id: String!
            quality: Int!
            ): JSON
    }

`;

const ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

 
const addBlock = (parentId, id) => { 
    let block = Object.assign({}, newDeckBlock);
    // even if you copy object, children have the same reference. 
    // so you have to create a brand new array for children
    block.children = [];
    block.parentId = parentId;
    block.id = id;
    blocks.items[parentId].children.push(id);
    blocks.items[parentId].hasChildren = true;
    blocks.items[parentId].isExpanded = true;
    blocks.items[id] = block;
    return block; 
}

/*
    Repeat items using the following intervals:
    I(1):=1
    I(2):=6
    for n>2: I(n):=I(n-1)*EF
    where:
    I(n) - inter-repetition interval after the n-th repetition (in days),
    EF - E-Factor of a given item
    If interval is a fraction, round it up to the nearest integer.
 */

const nextIntervalSm2 = (n, eF) => {
    if (n === 1) return 1;
    if (n === 2) return 6;
    return eF * nextIntervalSm2(n, eF);
}


// TODO: no logic for advancing Topics is sm2
const advanceCardSm2 = (itemBlock, q) => {
    let date = new Date();
    let stats = itemBlock.data.repetitionStatsSm2;
    stats.history.push({
        quality: q,
        date: String(date)
    })
    let eF = card.repetitionStatsSm2.eFactor;
    let newEf = eF + (0.1-(5-q)*(0.08+(5-q)*0.02));
    stats.repetitionsCount++
    let nextInterval = Math.round(nextIntervalSm2(stats.repetitionsCount, eF));
    if (q < 3) {
        state.nextDate = '-1';  
    } else {
        let newDate = date.addDays(nextInterval);
        stats.nextDate = newDate.toDateString();
    }
    
    stats.eFactor = newEf;
    return card; 
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}



// TODO: no error checking here
const resolvers = {  
    JSON: GraphQLJSON, 
    Query: {   
        items: () => items,
        blocks: () => blocks
    },
    Mutation: {
        advanceCard: (parent, {id, quality : q}) => {
            let itemBlock = blocks.items[id]
            if (itemBlock.data.type === 'f' || itemBlock.data.type === 'T') {
                return advanceCardSm2(itemBlock, q);
            } else {
                console.error("Trying to advance non-item");
            }
            
        },
        getDueCardsIds: (_, {deckId}) => {
            // let deckBlock = blocks.items[deckId];
            // let cardsIds = cardsIdsgetCardsIdsOfDeck(deckBlock);
            // let dueCardsIds = selectDueCardsIds(cardsIds);
            // return dueCardsIds;
            return getDueCardsIds(deckId);
        },
        addDeck: (parent, {parentId}) => {
            let id = ID();
            let block = addBlock(parentId, id);
            block.data = {
                type: 'D',
                name: `deck ${id}`
            }
            return blocks;
        },
        addItem: (parent, {type, parentId}) => { 
            let item = type === 'f' ? Object.assign({}, newCard) : Object.assign({}, newTopic);
            item.id = `_${ID()}`; 
            items = [...items, item];
            
            let block = addBlock(parentId, item.id);
            block.data = {
                type,
                name: `${type} ${item.id}`
            }
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
        card: (parent, { id }) => { 
            return _.find(items, {id: id})
        },
        saveCard: (parent, {id, templateTitle, entries}) => {
            let card = _.find(items, {id: id});
            let idx = items.indexOf(card);
            card = {
                id, 
                templateTitle, 
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
            let parent = blocks.items[block.parentId]
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
            let parent = blocks.items[newBlock.parentId]
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