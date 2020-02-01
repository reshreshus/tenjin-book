const { ApolloServer, gql } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
import { makeExecutableSchema } from 'graphql-tools';

import _ from 'lodash';

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
    }
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


const typeDefs = `
    scalar JSON

    type Block {
        id: String
        idx: String
        name: String
        expanded: Boolean
        type: String
        deck: String
        path: [String]
        children: [Block] 
    }

    type Card {
        id: ID,
        template_id: String,
        deck_title: String,
        template_title: String,
        entries: [CardEntry]
    }

    type CardEntry {
        id: ID,
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
            deck_title: String
            template_title: String
            entries: [JSON]
        ): Card,
        saveBlocks (
            blocks: [JSON]
        ): [JSON]
    }
`;

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
        card: (parent, { id }) => _.find(cards, {id: id}),
        saveCard: (parent, {id, template_title, deck_title, entries}) => {
            let card = _.find(cards, {id: id});
            let idx = cards.indexOf(card);
            card = {
                id, 
                template_title, 
                deck_title,   
                entries
            }
            cards[idx] = card;
            return card;
        },
        saveBlocks: (parent, {blocks : newBlocks}) => {
            console.log("blocks", block);
            blocks = newBlocks;
            return newBlocks;
        }
    }
};

// export const jsSchema = makeExecutableSchema({ typeDefs, resolvers });
export const server = new ApolloServer({ cors: {
            origin: '*'}			// <- allow request from all domains
            // credentials: true}		// <- enable CORS response for requests with credentials (cookies, http authentication)
    , typeDefs, resolvers });