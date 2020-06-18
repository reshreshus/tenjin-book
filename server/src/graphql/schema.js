export const typeDefs = `
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
    interval: String
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
  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
  }
  type Query {
    tree: JSON,
    cardEntry(id: ID!): CardEntry
    me: User
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): JSON!,
    login(email: String!, password: String): JSON!
    backup: String,
    addCardEntry(
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