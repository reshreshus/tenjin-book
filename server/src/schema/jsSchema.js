const { ApolloServer } = require('apollo-server');
const GraphQLJSON = require('graphql-type-json');
// import { makeExecutableSchema } from 'graphql-tools';
import { getTree, getItem, updateTree, updateItem, insertItem, backup } from '../db';
import { advanceCardSm2 } from '../srs/algo';

let tree = {}
getTree().then(result => tree = result);

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
  data: { }
}

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

const updateTreeDb = async (newTree = tree) => {
  updateTree(newTree);
}

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

  type Query {
    tree: JSON,
    cardEntry(id: ID!): CardEntry
  }

  type Mutation {
    backup: String,
    items: [JSON],
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

// TODO: no logic for advancing Topics is sm2
const advanceCard = (treeItem, q) => {
  let date = new Date();
  let stats = treeItem.data.repetitionStatsSm2;
  stats = advanceCardSm2(stats, q, date);
}

const deleteTreeItemChildren = (childrenIds) => {
  console.log("deleteTreeItemChildren", childrenIds);
  if (!childrenIds) {
    console.error("no children");
    return;
  }
  let treeItem;
  childrenIds.forEach(id => {
    treeItem = tree.items[id];
    if (treeItem.hasChildren) {
      deleteTreeItemChildren(treeItem.children);
    }
    delete tree.items[id];
  })
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
    tree: () => tree,
  },
  Mutation: {
    backup: () => {
      backup();
      return "ok"
    },
    items: () => tree,
    advanceCard: (_, {id, quality : q}) => {
      let itemTreeItem = tree.items[id]
      if (itemTreeItem.data.type === 'f' || itemTreeItem.data.type === 'T') {
        advanceCard(itemTreeItem, q);
        updateTreeDb(tree)
        return tree;
      } else {
        console.error("Trying to advance non-item");
      }

    },
    addDeck: (_, {parentId}) => {
      let id = ID();
      let treeItem = addTreeItem(parentId, id);
      treeItem.data = {
        type: 'D',
        name: `deck ${id}`,
      }
      updateTreeDb(tree);
      return tree;
    },
    addItem: (_, {type, parentId}) => {
      let item = type === 'f' ? Object.assign({}, newCard) : Object.assign({}, newTopic);
      item.id = `_${ID()}`;
      insertItem(item);

      let treeItem = addTreeItem(parentId, item.id);
      treeItem.data = {
        type,
        name: `${type} ${item.id}`,
        status: type === 'f' ? 'active' : 'dismissed',
        repetitionStatsSm2: {
          eFactor: 2.5,
          repetitionsCount: 0,
          nextDate: '-1',
          history: []
        }
      }
      updateTreeDb(tree);
      return {newTree : tree, newTreeItem : treeItem};
    },
    addCardEntry: (_, { id, name, content, type, card_id}) => {
      const card = getItem(id);
      card.entries.push({
        name,
        content,
        type,
        id
      });
      updateItem(card.id, card)
      return card.entries;
    },
    card: (_, { id }) => {
      return getItem(id);
    },
    saveCard: (_, {id, templateTitle, entries}) => {
      let card = getItem(id);
      card = {
        id,
        templateTitle,
        entries
      }
      updateItem(card.id, card)
      return card;
    },
    saveTree: (_, {newTree}) => {
      tree = newTree;
      updateTreeDb(newTree);
      return tree;
    },
    renameTreeItem: (_, {id, newName}) => {
      tree.items[id].data.name = newName;
      updateTreeDb(tree);
      return tree.items[id];
    },
    deleteTreeItem: (_, {id}) => {
      let treeItem = tree.items[id];
      deleteTreeItemChildren(treeItem.children);
      delete tree.items[id];
      let parent = tree.items[treeItem.parentId]
      let idx = parent.children.indexOf(id);
      parent.children.splice(idx, 1);
      if (parent.children.length === 0) {
        parent.hasChildren = false;
      }
      updateTreeDb(tree);
      return tree;
    },
    duplicateTreeItem: (_, {id}) => {
      let treeItem = tree.items[id];
      let newTreeItem = Object.assign({}, treeItem);
      let newId = ID();
      newTreeItem.children = [];
      newTreeItem.id = newId;
      newTreeItem.hasChildren = false;
      // Apparently, Object.assign just copies references of inside objects
      newTreeItem.data = Object.assign({}, treeItem.data);
      newTreeItem.data.name = `${newTreeItem.data.name} (dupl)`
      let parent = tree.items[newTreeItem.parentId];
      let idx = parent.children.indexOf(id);
      parent.children.splice(idx + 1, 0, newId);
      tree.items[newId] = newTreeItem;
      // duplicate flashcard as well
      if (newTreeItem.data.type === 'f' || newTreeItem.data.type === 'T') {
        getItem(id).then(result => {
          result.id = newId;
          delete result._id;
          insertItem(result);
        });
      }
      updateTreeDb(tree);
      return tree;
    }
  }
};

// export const jsSchema = makeExecutableSchema({ typeDefs, resolvers });
export const server = new ApolloServer({ cors: {
      origin: '*'}			// <- allow request from all domains
      // credentials: true}		// <- enable CORS response for requests with credentials (cookies, http authentication)
  , typeDefs, resolvers });