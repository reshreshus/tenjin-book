import { gql } from 'apollo-boost';

export const ADVANCE_CARD = gql`
    mutation advanceCard($id: String!, $quality: Int!) {
        advanceCard(id: $id, quality: $quality)
    }
`

export const ADD_DECK = gql`
    mutation addDeck($parentId: String!) {
        addDeck(parentId: $parentId)
    }
`

export const DUPLICATE_TREE = gql`
    mutation duplicateTree($id: String!) {
        duplicateTree(id: $id)
    }
`

export const DELETE_TREE = gql`
    mutation deleteTree($id: String!) {
        deleteTree(id: $id)
    }
`

export const RENAME_TREE = gql`
    mutation renameTree($id: String!, $newName: String!) {
        renameTree(id: $id, newName: $newName) {
            data {
                name
            }
        }
    }
`

export const ADD_ITEM = gql`
    mutation addItem($type: String!, $parentId: String!){
        addItem(type: $type, parentId: $parentId)
    }
`
export const SAVE_TREE = gql`
    mutation Tree($newTree: JSON) {
        saveTree (newTree: $newTree)
    }
`;

export const GET_TREE = gql`
    {
        tree 
    }
`;

export const GET_CARD = gql`
    mutation Card($id: ID!) {
        card (id: $id) {
            id
            templateTitle
            entries {
                id
                name
                content
                type
            }
        }
    }
`;

export const SAVE_CARD = gql`
    mutation SaveCard($id: ID!, $templateTitle:String!, $entries: [JSON]) { 
            saveCard(id: $id, templateTitle: $templateTitle, entries: $entries) {
            id
            entries {
                content
            }
        }
    }
`;

export const ADD_CARD_ENTRY = gql`
    mutation AddCardEntry($id: Int!, $name: String!, $content: JSON!, $type: String!, $cardId: ID!) {
        addCardEntry(id: $id, name: $name, content: $content, type: $type, cardId: $cardId) {
            id
            content
        }
    }
`;