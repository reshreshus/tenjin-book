const GraphQLJSON = require('graphql-type-json');
import { getTree, getItem, updateTree, updateItem, insertItem, backup } from '../db';
import { advanceCardSm2 } from '../srs/algo';
import { newCard, newTopic, newDeckTreeItem } from './templates';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let tree = {}
getTree().then(result => tree = result);

const users = [{ id: 'dummy', username: 'd', email: 'd@f.com', password: '$2b$12$0O/2f7MtDM5o67Zb/XSUteyCUv2RA0lQ63k7kX2H1Rl2C6QbZSHwu'}]

// TODO: no error checking here
export const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    tree: async (_, __, { user }) => {
      // console.log("user", user)
      if (user) {
        let tree = await getTree(user.id);
        // console.log({tree})
        return tree;
      }
      else return null
      return tree;
    },
    me: async (_, __, { user }) => {
      // console.log("me", {user})
      if (user) {
        return user;
      }
      return null;
    },
  },
  Mutation: {
    register: async (parent, args) => {
      console.log("REGISTER")
      try {

        const user = args;
        // console.log({user});
        user.password = await bcrypt.hash(user.password, 12);
        users.push(user);

        return {
          ok: true,
          user
        }
      } catch (e) {
        return {
          false: ok,
          errors: e
        }
      }
    },
    login: async (_, { email, password }, { SECRET }) => {
      // console.log("login");
      const user = users.filter(u => u.email === email)[0];
      // console.log({user})
      if (!user) {
        return {
          ok: false,
          token: null,
          error: 'no user with this email'
        }
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return {
          ok: false,
          token: null,
          error: 'wrong password'
        }
      }

      const token = jwt.sign(
        { user },
        SECRET,
        { expiresIn: '1d'}
      );
      // console.log({token})
      return  {
        ok: true,
        token
      };
    },
    backup: (_, __, { user }) => {
      backup();
      return "ok"
    },
    advanceCard: (_, {id, quality : q}, { user }) => {
      let itemTreeItem = tree.items[id]
      if (itemTreeItem.data.type === 'f' || itemTreeItem.data.type === 'T') {
        advanceCard(itemTreeItem, q);
        updateTree(user.id, tree)
        return tree;
      } else {
        console.error("Trying to advance non-item");
      }

    },
    addDeck: (_, {parentId}, { user }) => {
      let id = ID();
      let treeItem = addTreeItem(parentId, id);
      treeItem.data = {
        type: 'D',
        name: `deck ${id}`,
      }
      updateTree(user.id, tree);
      return tree;
    },
    addItem: (_, {type, parentId}, { user }) => {
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
      updateTree(user.id, tree);
      return {newTree : tree, newTreeItem : treeItem};
    },
    addCardEntry: (_, { id, name, content, type, card_id}, { user }) => {
      const card = getItem(user.id, id);
      card.entries.push({
        name,
        content,
        type,
        id
      });
      udateItem(user.id, card.id, card)
      return card.entries;
    },
    card: (_, { id }, { user }) => {
      return getItem(user.id, id);
    },
    saveCard: (_, {id, templateTitle, entries}, { user }) => {
      let card = getItem(user.id, id);
      card = {
        id,
        templateTitle,
        entries
      }
      updateItem(user.id, card.id, card)
      return card;
    },
    saveTree: (_, {newTree}, { user }) => {
      tree = newTree;
      updateTree(user.id, newTree);
      return tree;
    },
    renameTreeItem: (_, {id, newName}, { user }) => {
      tree.items[id].data.name = newName;
      updateTree(user.id, tree);
      return tree.items[id];
    },
    deleteTreeItem: (_, {id}, { user }) => {
      let treeItem = tree.items[id];
      deleteTreeItemChildren(treeItem.children);
      delete tree.items[id];
      let parent = tree.items[treeItem.parentId]
      let idx = parent.children.indexOf(id);
      parent.children.splice(idx, 1);
      if (parent.children.length === 0) {
        parent.hasChildren = false;
      }
      updateTree(user.id, tree);
      return tree;
    },
    duplicateTreeItem: (_, {id}, { user }) => {
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
        getItem(user.id, id).then(result => {
          result.id = newId;
          delete result._id;
          insertItem(result);
        });
      }
      updateTree(user.id, tree);
      return tree;
    }
  }
};

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