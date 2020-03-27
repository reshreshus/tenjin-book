const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

let tree = {
    "rootId": "-1",
    "items": {
      "0": {
        "id": "0",
        "hasChildren": true,
        "children": [
          "1",
          "2",
          "3"
        ],
        "isExpanded": true,
        "parentId": null,
        "data": {
          "name": "Deck",
          "count": 6,
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [
            "1"
          ],
          "dueItemsCount": 3
        }
      },
      "1": {
        "id": "1",
        "hasChildren": true,
        "children": [
          "4",
          "_0"
        ],
        "isExpanded": false,
        "parentId": "0",
        "data": {
          "name": "English",
          "type": "D",
          "dueItemsIds": [
            "_0"
          ],
          "dueDecksIds": [
            "4"
          ],
          "dueItemsCount": 3
        }
      },
      "2": {
        "id": "2",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "0",
        "data": {
          "name": "Math",
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [],
          "dueItemsCount": 0
        }
      },
      "3": {
        "id": "3",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "0",
        "data": {
          "name": "Programming",
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [],
          "dueItemsCount": 0
        }
      },
      "4": {
        "id": "4",
        "hasChildren": true,
        "children": [
          "5",
          "_1"
        ],
        "isExpanded": false,
        "parentId": "1",
        "data": {
          "name": "Witcher 3",
          "type": "D",
          "dueItemsIds": [
            "_1"
          ],
          "dueDecksIds": [
            "5"
          ],
          "dueItemsCount": 2
        }
      },
      "5": {
        "id": "5",
        "hasChildren": true,
        "children": [
          "_2"
        ],
        "isExpanded": false,
        "parentId": "4",
        "data": {
          "name": "The Last Wish",
          "type": "D",
          "dueItemsIds": [
            "_2"
          ],
          "dueDecksIds": [],
          "dueItemsCount": 1
        }
      },
      "-1": {
        "id": "-1",
        "hasChildren": true,
        "children": [
          "__72222kaq2",
          "_uxjp9sy22",
          "_8o6ndlpdy",
          "_6zt4dd4g6",
          "_lfn4fhd3j",
          "0",
          "_3nlqdffvl",
          "_hpmmkzp29",
          "_4za1po7ma"
        ],
        "isExpanded": true,
        "data": {
          "name": "Root Tree (for atlaskit)",
          "dueItemsIds": [
            "__72222kaq2",
            "_uxjp9sy22",
            "_8o6ndlpdy",
            "_6zt4dd4g6",
            "_lfn4fhd3j"
          ],
          "dueDecksIds": [
            "0"
          ],
          "dueItemsCount": 8
        }
      },
      "_0": {
        "id": "_0",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "1",
        "data": {
          "name": "a flashcard",
          "type": "f",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        }
      },
      "_1": {
        "id": "_1",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "1",
        "data": {
          "name": "2nd flashcard",
          "type": "f",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        }
      },
      "_2": {
        "id": "_2",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "5",
        "data": {
          "name": "3rd flashcard",
          "type": "f",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        }
      },
      "__72222kaq2": {
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "data": {
          "type": "T",
          "name": "Hi, click here",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        },
        "parentId": "-1",
        "id": "__72222kaq2"
      },
      "_6zt4dd4g6": {
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "data": {
          "type": "T",
          "name": "Topic",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        },
        "parentId": "-1",
        "id": "_6zt4dd4g6"
      },
      "_8o6ndlpdy": {
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "data": {
          "type": "f",
          "name": "Flashcard",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        },
        "parentId": "-1",
        "id": "_8o6ndlpdy"
      },
      "_uxjp9sy22": {
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "data": {
          "type": "T",
          "name": "Editor",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        },
        "parentId": "-1",
        "id": "_uxjp9sy22"
      },
      "_lfn4fhd3j": {
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "data": {
          "type": "T",
          "name": "Decks",
          "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "history": []
          }
        },
        "parentId": "-1",
        "id": "_lfn4fhd3j"
      },
      "_3nlqdffvl": {
        "id": "_3nlqdffvl",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "-1",
        "data": {
          "name": "Programming (dupl)",
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [],
          "dueItemsCount": 0
        }
      },
      "_hpmmkzp29": {
        "id": "_hpmmkzp29",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "-1",
        "data": {
          "name": "You can also toggle left sidebar with Alt+C",
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [],
          "dueItemsCount": 0
        }
      },
      "_4za1po7ma": {
        "id": "_4za1po7ma",
        "hasChildren": false,
        "children": [],
        "isExpanded": false,
        "parentId": "-1",
        "data": {
          "name": "And right sidebar with Alt+V",
          "type": "D",
          "dueItemsIds": [],
          "dueDecksIds": [],
          "dueItemsCount": 0
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
    },
    {
        "id": "__72222kaq2",
        "templateTitle": "Basic",
        "entries": [
          {
            "id": 0,
            "name": "markdown entry",
            "format": "markdown",
            "content": "x^2 = y",
            "type": "C",
            "__typename": "CardEntry",
          },
          {
            "id": 1,
            "name": "Front",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "This is ROI Notebook.A flashcards application inspired by"
                  }
                },
                {
                  "type": "list",
                  "data": {
                    "style": "ordered",
                    "items": [
                      "SuperMemo",
                      "Anki",
                      "Vimflowy / Workflowy"
                    ]
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "It uses a tree (on the left) to navigate decks, cards and topics.Decks are collection of cards and topics - items (or notes).Card is what you repeat, which has front and back. Topic does not have an answer field so you're supposed to process it in a different way, than a flashcard. So far you can only store topics, further functionality will be provided later."
                  }
                }
              ]
            },
            "type": "C",
            "__typename": "CardEntry",
            "key": "0__72222kaq2"
          }
        ],
        "__typename": "Card"
      },
      {
        "id": "_uxjp9sy22",
        "templateTitle": "Basic",
        "entries": [
          {
            "id": 0,
            "name": "Front",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "This version is using EditorJs.My current estimation of is that it SUCKS (at this point, at least)"
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Press tab on an empty line and you'll have options (not everything works)"
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Press tap on a non-empty line and you'll have options on how to process it."
                  }
                }
              ]
            },
            "type": "C",
            "__typename": "CardEntry",
            "key": "0_uxjp9sy22"
          }
        ],
        "__typename": "Card"
      },
      {
        "id": "_8o6ndlpdy",
        "templateTitle": "Basic",
        "entries": [
          {
            "id": 0,
            "name": "Front",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "This item has a question in it. So it's a flashcard."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "An item has fields in it. We call it entries."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Each entry has a name (which you can't yet choose) and a type, which you can choose by clicking.'Q' means question, 'A' means answer, 'C' means custom."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "When repeating a flashcard, 'Q' entries will be shown, 'A' items will be shown after you click 'Show Answer'. "
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Try by clicking 'Preview' button on the bottom.&nbsp;"
                  }
                }
              ]
            },
            "type": "C",
            "__typename": "CardEntry",
            "key": "0_8o6ndlpdy"
          },
          {
            "id": 1,
            "name": "New Entry",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "What is a cat (masculine) in spanish?"
                  }
                }
              ]
            },
            "type": "Q",
            "__typename": "CardEntry",
            "key": "1_8o6ndlpdy"
          },
          {
            "id": 2,
            "name": "New Entry",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Gato"
                  }
                }
              ]
            },
            "type": "A",
            "__typename": "CardEntry",
            "key": "2_8o6ndlpdy"
          }
        ],
        "__typename": "Card"
      },
      {
        "id": "_6zt4dd4g6",
        "templateTitle": "Basic",
        "entries": [
          {
            "id": 0,
            "name": "Front",
            "format": "markdown",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Topic is an item that does not have a 'Q' type of field."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Changing the type of this Topic to 'Q' will make it a flashcard."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "On the top you can see Deck which contains this item."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                    "text": "You can also preview Topic, but at the moment you won't see anything"
                  }
                }
              ]
            },
            "type": "C",
            "__typename": "CardEntry",
            "key": "0_6zt4dd4g6"
          }
        ],
        "__typename": "Card"
      },
      {
        "id": "_lfn4fhd3j",
        "templateTitle": "Basic",
        "entries": [
          {
            "id": 0,
            "name": "Front",
            "content": {
              "tree": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": ""
                  }
                }
              ],
              "blocks": [
                {
                  "type": "paragraph",
                  "data": {
                    "text": "Decks are collections of topics and cards. You can repeat cards by clicking on a deck and then clicking 'Study' button."
                  }
                }
              ]
            },
            "type": "C",
            "__typename": "CardEntry",
            "key": "0_lfn4fhd3j"
          }
        ],
        "__typename": "Card"
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
        format: String
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
            if (newTreeItem.data.type === 'f' || newTreeItem.data.type === 'T'){
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