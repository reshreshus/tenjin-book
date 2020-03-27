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

export const DUPLICATE_TREE_ITEM = gql`
    mutation duplicateTreeItem($id: String!) {
        duplicateTreeItem(id: $id)
    }
`

export const DELETE_TREE_ITEM = gql`
    mutation deleteTreeItem($id: String!) {
        deleteTreeItem(id: $id)
    }
`

export const RENAME_TREE_ITEM = gql`
    mutation renameTreeItem($id: String!, $newName: String!) {
        renameTreeItem(id: $id, newName: $newName) {
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
                format
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