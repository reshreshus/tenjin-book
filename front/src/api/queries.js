import { gql } from 'apollo-boost';

export const GET_ME = gql`
  {
    me {
      username
    }
  }
`

export const REGISTER = gql`
  mutation register($email: String!, $username: String!, $password: String!) {
    register(email: $email, username: $username, password: $password)
  }
`

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

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

export const GET_ITEMS = gql`
  mutation {
    items
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
        format
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

export const BACKUP = gql`
  mutation Backup {
    backup
  }
`