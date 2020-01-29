const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = graphql;

export const blocks = [
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

export const cards = [{
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

const CardEntryType = new GraphQLObjectType({
    name: 'CardEntry',
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        content: { type: GraphQLString} // TODO: ha?
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

module.exports = new GraphQLSchema({
    query: RootQuery
});