const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

let tree = {
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
            children: ["5", "_1"],
            isExpanded: false,
            parentId:  "1",
            data: {
                name: "Witcher 3",
                type: "D", 
            }
        },
        "5": {
            id: "5",
            hasChildren: true,
            children: ["_2"],
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
                    history: []
                }
            }
        },
        "_1": {
            id: "_1",
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentId:  "1",
            data: {
                name: "2nd flashcard",
                type: "f",
                repetitionStatsSm2: {
                    eFactor: 2.5,
                    repetitionsCount: 0,
                    nextDate: '-1',
                    history: []
                }
            }
        },
        "_2": {
            id: "_2",
            hasChildren: false,
            children: [],
            isExpanded: false,
            parentId:  "5",
            data: {
                name: "3rd flashcard",
                type: "f",
                repetitionStatsSm2: {
                    eFactor: 2.5,
                    repetitionsCount: 0,
                    nextDate: '-1',
                    history: []
                }
            }
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
                tree: [{
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
                tree: [{
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
                tree: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            } 
        }
    ]
}

const newDeckTreeItem = {
    hasChildren: false,
    children: [],
    isExpanded: false,
    data: {

    }
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
    },
    {
        id: "_1",
        templateId: "from db",
        templateTitle: "Basic",
        entries: [
            {
                id: 0,
                name: "Front",
                content: {
                    blocks: [{
                        type: "paragraph",
                        data: { text: "2nd flashcard question" }
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
                        data: { text: "2nd flashcard answer" }
                    }]
                },   
                type: "A",
            },
            
        ]
    },
    {
        id: "_2",
        templateId: "from db",
        templateTitle: "Basic",
        entries: [
            {
                id: 0,
                name: "Front",
                content: {
                    blocks: [{
                        type: "paragraph",
                        data: { text: "3rd flashcard question" }
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
                        data: { text: "3rd flashcard answer" }
                    }]
                },   
                type: "A",
            },
            
        ]
    }
]


const typeDefs = `
    scalar JSON

    type TreeItemData {
        name: String
        type: String
        repetitionStatsSm2: RepetitionStatsSm2
    }

    type TreeItem {
        hasChildren: Boolean
        children: [String]
        isExpanded: Boolean
        parentId: String
        data: TreeItemData
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
        tree: JSON,
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
        saveTree (
            newTree: JSON
        ): JSON,
        renameTreeItem (
            id: String!
            newName: String!
        ): TreeItem,
        deleteTreeItem (id: String!): JSON,
        duplicateTreeItem (id: String!): JSON,
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

 
const addTreeItem = (parentId, id) => { 
    let treeItem = Object.assign({}, newDeckTreeItem);
    // even if you copy object, children have the same reference. 
    // so you have to create a brand new array for children
    treeItem.children = [];
    treeItem.parentId = parentId;
    treeItem.id = id;
    tree.items[parentId].children.push(id);
    tree.items[parentId].hasChildren = true;
    tree.items[parentId].isExpanded = true;
    tree.items[id] = treeItem;
    return treeItem; 
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
    return eF * nextIntervalSm2(n - 1, eF);
}


// TODO: no logic for advancing Topics is sm2
const advanceCardSm2 = (itemTreeItem, q) => {
    let date = new Date();
    let stats = itemTreeItem.data.repetitionStatsSm2;
    stats.history.push({
        quality: q,
        date: String(date)
    }); 
    let eF = stats.eFactor;
    let newEf = eF + (0.1-(5-q)*(0.08+(5-q)*0.02));
    stats.repetitionsCount++
    let nextInterval = Math.round(nextIntervalSm2(stats.repetitionsCount, eF));
    if (q < 3) {
        stats.nextDate = '-1';  
    } else {
        let newDate = date.addDays(nextInterval);
        stats.nextDate = newDate.toDateString();
    }
    
    stats.eFactor = newEf;
    return itemTreeItem; 
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
        tree: () => tree
    },
    Mutation: {
        advanceCard: (parent, {id, quality : q}) => {    
            let itemTreeItem = tree.items[id]
            if (itemTreeItem.data.type === 'f' || itemTreeItem.data.type === 'T') {
                advanceCardSm2(itemTreeItem, q);  
                return tree;
            } else {
                console.error("Trying to advance non-item");
            }
            
        },
        addDeck: (parent, {parentId}) => {
            let id = ID();
            let treeItem = addTreeItem(parentId, id);
            treeItem.data = {
                type: 'D',
                name: `deck ${id}`,
            }
            return tree;
        },
        addItem: (parent, {type, parentId}) => { 
            let item = type === 'f' ? Object.assign({}, newCard) : Object.assign({}, newTopic);
            item.id = `_${ID()}`; 
            items = [...items, item];
            
            let treeItem = addTreeItem(parentId, item.id);
            treeItem.data = {
                type,
                name: `${type} ${item.id}`,
                repetitionStatsSm2: {
                    eFactor: 2.5,
                    repetitionsCount: 0,
                    nextDate: '-1',
                    history: []
                }
            }
            return tree;
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
        saveTree: (parent, {newTree}) => {
            tree = newTree;
            return tree; 
        },
        renameTreeItem: (parent, {id, newName}) => {
            tree.items[id].data.name = newName;
            return tree.items[id];
        },
        deleteTreeItem: (_, {id}) => {
            // console.log("deleteTreeItem id", id);
            let treeItem = tree.items[id];
            delete tree.items[id];
            // console.log("deleted treeItem", treeItem);
            let parent = tree.items[treeItem.parentId]
            let idx = parent.children.indexOf(id);
            parent.children.splice(idx, 1); 
            if (parent.children.length === 0) {
                parent.hasChildren = false;
            }
            // console.log("deleteTreeItem tree", tree);
            return tree;
        },
        duplicateTreeItem: (_, {id}) => {
            let treeItem = tree.items[id];
            let newTreeItem = Object.assign({}, treeItem);
            let newId = ID();
            newTreeItem.children = []
            newTreeItem.id = newId;
            newTreeItem.hasChildren = false;
            // Apparently, Object.assign just copies references of inside objects
            newTreeItem.data = Object.assign({}, treeItem.data)
            newTreeItem.data.name = `${newTreeItem.data.name} (dupl)`
            let parent = tree.items[newTreeItem.parentId]
            let idx = parent.children.indexOf(id);
            parent.children.splice(idx + 1, 0, newId);
            tree.items[newId] = newTreeItem;
            // duplicate flashcard as well
            if (newTreeItem.data.type === 'f'){
                let card = Object.assign({}, items.filter(c => id === c.id)[0]);
                card.id = newId;
                items.push(card);
            }
            return tree;
        }
    }
};

// export const jsSchema = makeExecutableSchema({ typeDefs, resolvers });
export const server = new ApolloServer({ cors: {
            origin: '*'}			// <- allow request from all domains
            // credentials: true}		// <- enable CORS response for requests with credentials (cookies, http authentication)
    , typeDefs, resolvers });