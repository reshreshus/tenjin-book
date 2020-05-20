import React, { useState, useEffect } from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';

import { GET_TREE} from '../api/queries';
import { useQuery } from '@apollo/react-hooks';

import { selectElementContents, removeSelections,
     openContextMenu, hideContextMenu } from '../helpers/domHelpers'
import { getContextMutations } from './contextMutations';
import { appMenuItems } from './appMenuItems';

import { getRandomInt } from '../helpers/jsHelpers';

import { uploadDeckImage, deleteImage } from '../api/rest';


const Collection = React.createContext();

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
    ? JSON.parse(stickyValue)
    : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
  }

function CollectionProvider({children,
  duplicateTreeItem,
  deleteTreeItem,
  addDeck,
  addItem,
  saveCard,
  renameTreeItem,
  getCard,
  saveTree,
  advanceCard,
  backup
})
  {
  const [tree, updateTree] = useStickyState(null, 'tree');
  const [contextTreeItem, updateContextTreeItem] = useStickyState(null, 'context-tree-item');
  const [card, updateCard] = useStickyState(null, 'card');

  const [headerDeck, updateHeaderDeck] = useState(null);
  const [currentlyUsedDeck, updateCurrentlyUsedDeck] = useState();
  const [typeIsShown, updateTypeIsShown] = useState({
    'f': true,
    'T': true
  })
  const [editingMode, updateEditingMode] = useState({
    isStudying: false, // study or preview
    isEditing: true
  })
  const [rootTreeItem, updateRootTreeItem] = useState();

  const [isEditing, updateIsEditing] = useState(false);
  const {data: treeData} = useQuery(GET_TREE, {
    // TODO: query executes an unusual number of times
    onCompleted:  () => {
      console.log(treeData.tree);
      if (treeData.tree) {
        let tree = calculateDueItemsInTree(treeData.tree);
        updateTree(tree);
      }
    }
  });
  const [isAppMenuUsed, updateIsAppMenuUsed] = useState(false);

  const [sidebarIsShown, updateSidebarIsShown] = useState(true);
  const [sidebarWidth, updateSidebarWidth] = useState('21rem');
  const [rightSidebarIsShown, updateRightSidebarIsShown] = useState(true);

  const toggleLeftSidebar = () => {
    let sidebar = document.querySelector('.sidebar');
    if (sidebarIsShown) {
      updateSidebarWidth(sidebar.style.width);
      sidebar.style.transition = '400ms';
      sidebar.style.width = '4rem';
      updateSidebarIsShown(false)
    } else {
      updateSidebarIsShown(true);
      sidebar.style.width = sidebarWidth;
    }
  }

  const addItemHeaderDeck = async (type='f') => {
    if (headerDeck) {
      const newTreeItem = await addItemContext(type, headerDeck);
      setCardContext(newTreeItem.id)
      updateContextTreeItem(newTreeItem)
    }
  }

  useEffect(() => {
    document.querySelectorAll('.resizer').forEach(e => {
      // setting default widths
      // e.previousElementSibling.style.width =
      // e.nextElementSibling.style.width=
      // e.parentNode.offsetWidth/3-e.offsetWidth/3+'px';
      // '600px';
      e.style.height = e.previousElementSibling.style.height;
      e.onmousedown= () => {
      e.parentNode.onmousemove = ev => {
        if (sidebarIsShown) {
          e.previousElementSibling.style.width =
          ev.clientX-e.offsetWidth/2+'px';
          e.nextElementSibling.style.width =
          e.parentNode.offsetWidth-ev.clientX-e.offsetWidth/2+'px';
        }
      };
      };
      e.parentNode.onmouseup = () => e.parentNode.onmousemove=undefined
    });
  })

  const zoomInDeckContext = (deckId=contextTreeItem.id) => {
    updateRootTreeItem(tree.items[deckId]);
  }

  const zoomOutContext = () => {
    if (rootTreeItem && rootTreeItem.parentId)
      updateRootTreeItem(tree.items[rootTreeItem.parentId]);
  }

  const uploadImageDeckContext = async (deckId, file) => {
    const url = await uploadDeckImage(deckId, file);
    const treeItem = tree.items[deckId]
    if (treeItem.data.img) {
      deleteImage(treeItem.data.img)
    }
    treeItem.data.img = url;
    // ?
    updateContextTreeItem(treeItem);
    saveTreeContext(tree);
  }

  const deleteImageDeckContext = (deckId=contextTreeItem.id) => {
    const treeItem = tree.items[deckId];
    if (treeItem.data.img) {
      deleteImage(treeItem.data.img)
      treeItem.data.img = null
    }
    updateContextTreeItem(treeItem);
    saveTreeContext(tree);
  }

  const isRepeatableItem = (treeItem) => {
    return treeItem.data.type === 'f' || treeItem.data.type === 'T';
  }

  const isDeck = (treeItem) => {
    return treeItem.data.type === 'D';
  }

  const dueCardsChanged = (treeItem) => {
    return treeItem.data.dueCardsChanged ? treeItem.data.dueCardsChanged : true;
  }

  const getDate = (dt = new Date()) => {
    return `${dt.getFullYear()}/${(dt.getMonth() + 1)}/${dt.getDate()}`
    // return dt.toGMTString();
  }

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return new Date(year, month - 1, day);
  }

  const isDue = (treeItem) => {
    if (treeItem.data.status === 'dismissed') return false;
    let today = new Date();
    // today = today.addDays(16);
    let nextDate = treeItem.data.repetitionStatsSm2.nextDate;
    if (nextDate === '-1') return true;
    else {
      nextDate = parseDate(nextDate);
      return today >= nextDate;
    }
  }

  // TODO: too many calculations and updates of the tree
  const calculateDueItemsInTreeItem = (parentItem, tree) => {
    // TODO
    if (!isRepeatableItem(parentItem)) {
      // dueItemsCount is calculated from descendents as well
      let dueItemsCount = 0;
      let dueDecksIds = []
      if (dueCardsChanged(parentItem)) {
        let dueItemsIds = []
        parentItem.children.forEach(childId => {
          let childItem = tree.items[childId];
          if (!isDeck(childItem)) {
            if (isDue(childItem)) {
              dueItemsIds.push(childId);
            }
          } else {
            let childsDueItemsCount = calculateDueItemsInTreeItem(childItem, tree);
            if (childsDueItemsCount > 0) {
              dueDecksIds.push(childId);
              dueItemsCount += childsDueItemsCount;
            }
          }
        });
        if (dueItemsIds) {
          dueItemsCount += dueItemsIds.length;
          parentItem.data.dueItemsIds = dueItemsIds;
        }
      } else {
        parentItem.children.forEach(childId => {
          let childItem = tree.items[childId];
          if (isDeck(childItem)) {
            // TODO: redundancy
            let childsDueItemsCount = calculateDueItemsInTreeItem(childItem, tree);
            if (childsDueItemsCount > 0) {
              dueDecksIds.push(childId);
              dueItemsCount += childsDueItemsCount;
            }
          }
        });
        if (parentItem.data.dueItemsIds) {
          dueItemsCount += parentItem.data.dueItemsIds.length;
        }
      }
      // TODO
      if (dueDecksIds) {
        parentItem.data.dueDecksIds = dueDecksIds;
      }
      parentItem.data.dueItemsCount = dueItemsCount;
      return dueItemsCount;
    } else {
      console.error("calculating due items from non-deck element")
    }
  }

  const calculateDueItemsInTree = (givenTree) => {
    console.log("calculateDueItemsInTree");
    let root = givenTree.items[givenTree.rootId];
    calculateDueItemsInTreeItem(root, givenTree);
    return givenTree;
  }

  // TODO: recalculate when moving, deleting, duplicating, adding an item
  // const recalculateTree = (treeItemsIds) => {
  // }

  const updateTreeAndAddParams = (newTree) => {
    calculateDueItemsInTree(newTree);
    updateTree(newTree);
  }

  const advanceCardContext = async (itemId, quality) => {
    let newTree = await advanceCard(itemId, quality);
    // TODO: optimize
    updateTree(newTree);
    calculateDueItemsInTree(newTree);
    // if we repeated the last
    if (currentlyUsedDeck.data.dueItemsCount <= 1) {
      updateContextTreeItem(currentlyUsedDeck)
    } else {
      setCardToRepeat(newTree.items[currentlyUsedDeck.id], newTree);
      updateCurrentlyUsedDeck(newTree.items[currentlyUsedDeck.id]);
    }
  }

  const setCardToRepeat = (deckTreeItem=currentlyUsedDeck, newTree=tree) => {
    let dueItemsIds = deckTreeItem.data.dueItemsIds;
    if (dueItemsIds.length > 0) {
      let nextDueItemId = getRandomInt(0, dueItemsIds.length - 1);
      updateContextTreeItem(newTree.items[dueItemsIds[nextDueItemId]]);
      // setCardContext(null);
      setCardContext(dueItemsIds[nextDueItemId]);
    } else if (deckTreeItem.data.dueDecksIds.length > 0) {
      setCardToRepeat(newTree.items[deckTreeItem.data.dueDecksIds[0]]);
    } else {
      console.error("No CARD TO REPEAT")
    }
  }

  const findLastDeck = (treeItem) => {
    // base case
    if (isDeck(treeItem)) {
      return treeItem;
    }

    let parent = tree.items[treeItem.parentId];
    if (!parent) {
      console.warn("couldn't find a parent");
      return tree.items[tree.rootId];
    }
    // if (parent.data.type === 'D') return parent
    return findLastDeck(parent);
  }

  const toggleExpanded = (treeItemId = contextTreeItem.id) => {
    const treeItem = tree.items[treeItemId];
    treeItem.isExpanded = !treeItem.isExpanded;
    updateTree(Object.assign({}, tree))
    //todo: optimize, make a query
    saveTree(tree);
  }

  const collapseAllChild = (id) => {
    const treeItem = tree.items[id];
    treeItem.isExpanded = false;
    treeItem.children.forEach(cId => collapseAllChild(cId))
  }

  const collapseAll = (treeItemId = contextTreeItem.id) => {
    console.log("collapseAll")
    const treeItem = tree.items[treeItemId];
    treeItem.isExpanded = false;
    treeItem.children.forEach(cId => collapseAll(cId))
    saveTreeContext(tree);
  }

  const updateContextTreeItemAndCleanup = (treeItem, treeItemRef) => {
    removeSelections();
    // if clicked on the same item let openContextMenu close it 
    // instead of opening again after hideContextMenu()
    if (contextTreeItem && contextTreeItem.id !== treeItem.id) {
      hideContextMenu();
    }
    updateContextTreeItem(Object.assign({}, treeItem));
  }

  const addNewEntryContext = () => {
    let newCard = Object.assign({}, card)
    let newId = Math.max.apply(Math, card.entries.map(e => e.id)) + 1;
    let newEntry = {
      name: "New Entry",
      content: {
        tree: [{
          type: "paragraph",
          data: { text: "" }
        }]
      },
      type: "C",
      id: newId
    }
    newCard.entries.push(newEntry)
    updateCard(newCard)
  }

  const deleteEntryContext = (entryID) => {
    let newCard = Object.assign({}, card);
    let newEntries = [...newCard.entries.filter((e => entryID !== e.id))];
    tree.items[newCard.id].data.type =  'T';
    newEntries.forEach(e => {
      if (e.type === 'Q') {
        tree.items[newCard.id].data.type = 'f';
      }
    });
    newCard.entries = newEntries;
    updateCard(newCard);
  }

  const chooseTypeContext = (cardId, entryId, type) => {
    let newCard = Object.assign({}, card);
    let entry = newCard.entries.filter(e => e.id === entryId)[0]
    entry.type = type;
    tree.items[cardId].data.type = 'T'
    newCard.entries.forEach(e => {
      if (e.type === 'Q') {
        tree.items[cardId].data.type = 'f';
      }
    })
    let newTree = Object.assign({}, tree)
    updateCard(newCard);
    // TODO: optimize
    saveTreeContext(newTree)
  }

  const selectTreeItemToRenameContext = () => {
    updateIsEditing(true);
    if (contextTreeItem) {
      let el = document.querySelector(`#tree-item-${contextTreeItem.id}`);
      selectElementContents(el);
    }
  }

  const saveTreeContext = (newTree) => {
    console.log("saveTreeContext")
    newTree = Object.assign({}, newTree);
    updateTreeAndAddParams(newTree);
    saveTree(newTree);
  }

  const duplicateTreeItemContext = async (treeItemId = contextTreeItem.id) => {
    let newTree = await duplicateTreeItem(treeItemId);
    updateTreeAndAddParams(newTree);
  }

  const deleteTreeItemContext = async (treeItemId = contextTreeItem.id) => {
    let tree = await deleteTreeItem(treeItemId);
    updateTreeAndAddParams(tree);
    updateContextTreeItem(null);
  }

  const renameTreeItemContext = async (newName, treeItemId) => {
    renameTreeItem(newName, treeItemId, updateTree);
    tree.items[treeItemId].data.name = newName;
    updateTree(Object.assign({}, tree));
  }

  // TODO: combine deck and item addition
  const addDeckContext = async (parentId = contextTreeItem.id) => {
    if (!isDeck(tree.items[parentId])) {
      alert('Cannot make a deck from this type of item');
      return;
    }
    let newTree = await addDeck(parentId);
    updateTree(newTree);
  }

  const addDeckRootElementContext = () => {
    addDeckContext(rootTreeItem ? rootTreeItem.id : tree.rootId)
  }

  const addItemRootElementContext = (type) => {
    // tree.items[tree.rootId].data.type = "D"
    // tree.items[rootTreeItem.id].data.type = "D"
    addItemContext(type, rootTreeItem ? tree.items[rootTreeItem.id] : tree.items[tree.rootId])
  }

  const addItemContext = async (type, treeItem = contextTreeItem) => {
    if (treeItem.data.type !== 'D') {
      alert('Cannot make an item from this type of item');
      return;
    }
    let {newTree, newTreeItem} = await addItem(treeItem.id, type);
    updateTreeAndAddParams(newTree);
    return newTreeItem;
  }

  const saveCardContext = (savedCard) => {
    let qEntries = savedCard.entries.filter(e => e.type === 'Q');
    let cEntries = savedCard.entries.filter(e => e.type === 'C');
    let entries = qEntries;
    entries.push(...cEntries);

    updateIsEditing(true);
    setTimeout(() => {
      let newName;
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        if (entry.format === "markdown") {
          newName = entry.content;
        } else {
          try {
            newName = entry.content.blocks[0].data.text;
          } catch {
            // TODO
          }
        }
        if (newName) {
          // temporary костыль
          if (!newName.startsWith('![](http://localhost:5000/media')) {
            newName = newName.slice(0, 50);
            tree.items[savedCard.id].data.name = newName;
            saveTreeContext(tree);
            break;
          }
        }
      }
      updateIsEditing(false);
    }, 100);

    updateCard(savedCard);
    saveCard(savedCard);
  }

  // TODO rename to set
  const setCardContext = async (id) => {
    // this little thing makes it possible to rerender EditorJs
    updateCard(null);
    let newCard = await getCard(id);
    updateCard(newCard);
  }

  const openTreeContextMenu = (e) => {
    updateIsAppMenuUsed(false);
    openContextMenu(e);
  }

  const openAppContextMenu = (e) => {
    updateIsAppMenuUsed(true);
    openContextMenu(e);
  }

  const dismissItemContext = () => {
    const item = tree.items[contextTreeItem.id];
    if (item.data.status === 'dismissed') {
      item.data.status = 'active'
    } else {
      item.data.status = 'dismissed'
    }
    saveTreeContext(tree);
  }

  let menuItems =  getContextMutations(
    addDeckContext,
    addItemContext,
    selectTreeItemToRenameContext,
    duplicateTreeItemContext,
    deleteTreeItemContext,
    toggleExpanded,
    dismissItemContext,
    collapseAll,
    zoomInDeckContext,
    zoomOutContext
  );

  return (
  <Collection.Provider value={{
    updateContextTreeItemAndCleanup,
    contextTreeItem,
    updateContextTreeItem,

    addDeckRootElementContext,
    addItemRootElementContext,

    tree,
    updateTree,
    selectTreeItemToRenameContext,
    renameTreeItemContext,
    saveTreeContext,
    zoomInDeckContext,
    rootTreeItem,

    headerDeck,
    updateHeaderDeck,

    card,
    saveCardContext,
    setCardContext,
    findLastDeck,
    addNewEntryContext,
    deleteEntryContext,
    chooseTypeContext,

    isEditing,
    updateIsEditing,
    editingMode,
    updateEditingMode,

    setCardToRepeat,
    advanceCardContext,
    updateCurrentlyUsedDeck,
    uploadImageDeckContext,
    deleteImageDeckContext,

    toggleExpanded,
    openTreeContextMenu,
    openAppContextMenu,
    hideContextMenu,
    sidebarIsShown,
    updateSidebarIsShown,
    rightSidebarIsShown,
    updateRightSidebarIsShown,
    toggleLeftSidebar,

    typeIsShown,
    updateTypeIsShown
    }}>
      {children}
      <ContextMenu menuItems={menuItems} appMenuItems={() => appMenuItems(backup)} isAppMenuUsed={isAppMenuUsed}/>
      <HotkeyApp menuItems={menuItems} addItemHeaderDeck={addItemHeaderDeck}/>
  </Collection.Provider>)
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};