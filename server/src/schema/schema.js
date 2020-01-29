const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = graphql;

import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';


const blocks = [
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

const cards = [{
    id: "_1",
    deck_id: "from db",
    // block_id: "from db",
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

const ObjectType = new GraphQLScalarType({
    name: 'ObjectType',
    serialize: value => value,
    parseValue: value => value,
    parseLiteral: (ast) => {
      if (ast.kind !== Kind.OBJECT) {
        throw new GraphQLError(
          `Query error: Can only parse object but got a: ${ast.kind}`, 
          [ast],
        );
      }
      return ast.value;
    },
});

const CardEntryType = new GraphQLObjectType({
    name: 'CardEntry',
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        content: { type: GraphQLJSON}, 
        entry_type: {type: GraphQLString}
    })
})

const CardType = new GraphQLObjectType({
    name: 'Card',
    fields: () => ({
        id: {type: GraphQLID},
        template_id: {type: GraphQLString},
        deck_title: {type: GraphQLString},
        template_title: {type: GraphQLString},
        entries: {type: new GraphQLList(CardEntryType)}
    })
})

const BlockType = new GraphQLObjectType({
    name: 'Block',
    fields: () => ({
        id: {type: GraphQLString},
        idx: {type: GraphQLString},
        name: {type: GraphQLString},
        expanded: {type: GraphQLBoolean},
        type: {type: GraphQLString},
        deck: {type: GraphQLString},
        path: {type: new GraphQLList(GraphQLString)},
        children: {
            type: new GraphQLList(BlockType),
            resolve(parent, args) {
                return parent.children;
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        card: {
            type: CardType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args) {
                return _.find(cards, {'id': args.id})
            }
        },
        cards: {
            type: new GraphQLList(CardType),
            resolve(parent, args) {
                return cards;
            }
        },
        block: {
            type: BlockType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args) {
                return _.find(blocks, {id: args.id})
            }
        },
        blocks: {
            type:new GraphQLList(BlockType),
            resolve(parent, args) {
                return blocks;
            }
        }
        
    }
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCardEntry: {
            type: CardEntryType,
            args: {
                name: {type: GraphQLString},
                content: { type: GraphQLJSON}, 
                entry_type: {type: GraphQLString},
                card_id: {type: GraphQLString}
            },
            resolve(parent, args) {
                let card = _.find(cards, {id: args.card_id})
                
                card.entries.push({
                    name: args.name,
                    entry_type: args.entry_type,
                    id: card.entries.length
                })
                console.log("card", card)
                console.log("card content", card.content)
                return card.entries;    
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});