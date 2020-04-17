import React, {useState, useEffect} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';

import { GET_TREE} from '../api/queries';
import { useQuery } from '@apollo/react-hooks';

import { selectElementContents, removeSelections, 
         openContextMenu, hideContextMenu } from '../helpers/domHelpers'
import { getContextMutations } from './contextMutations';
import { appMenuItems } from './appMenuItems';


const Collection = React.createContext();

function CollectionProvider({children, 
    duplicateTreeItem, 
    deleteTreeItem,
    addDeck,
    addItem,
    saveCard,
    renameTreeItem,
    getCard,
    saveTree,
    advanceCard
}) 
    {
    const [tree, updateTree] = useState(null) 
    const [contextTreeItem, updateContextTreeItem] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);
    const [isEditing, updateIsEditing] = useState(false);
    const [card, updateCard] = useState(null);

    const [currentlyUsedDeck, updateCurrentlyUsedDeck] = useState();

    const [editingMode, updateEditingMode] = useState({
        isStudying: false, // study or preview
        isEditing: true
    })

    const {data: treeData, loading: treeLoading, error: treeError} = useQuery(GET_TREE, {
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

    const getCardsIdsOfDeck = (treeItem, findDue = false) => {
        if (!treeItem.hasChildren) return [];
        let cardsIds = []
        
        treeItem.children.map(cId => {
            let curTreeItem = tree.items[cId]
            if (isRepeatableItem(curTreeItem) && (!findDue || isDue(curTreeItem))) {
                cardsIds.push(cId);
            }
            if (curTreeItem.hasChildren) {
                cardsIds = [...cardsIds, ...getCardsIdsOfDeck(curTreeItem)]
            }
        })
        return cardsIds;
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
        return dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
    }

    const isDue = (treeItem) => {
        let today = getDate(); 
        let nextDate = treeItem.data.repetitionStatsSm2.nextDate;
        // nextDate === '-1' it is a new card
        return nextDate === today || nextDate === '-1';
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
                parentItem.children.map(childId => {
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
                parentItem.children.map(childId => {
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
    const recalculateTree = (treeItemsIds) => {

    }

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
            updateContextTreeItem(newTree.items[dueItemsIds[0]]);
            setCardContext(dueItemsIds[0]);
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
        let treeItem = tree.items[treeItemId];
        treeItem.isExpanded = !treeItem.isExpanded;
        updateTree(Object.assign({}, tree))
        //todo: optimize, make a query
        saveTree(tree);
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
            name:"New Entry", 
            content: {
                tree: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            },
            type:"C",
            id: newId
        }
        
        newCard.entries.push(newEntry)
        updateCard(newCard)
    }

    const deleteEntryContext = (entryID) => {
        let newCard = Object.assign({}, card);
        let newEntries = [...newCard.entries.filter((e => entryID !== e.id))];
        tree.items[newCard.id].data.type =  'T';
        newEntries.map(e => {
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
        newCard.entries.map(e => {
            if (e.type === 'Q') {
                tree.items[cardId].data.type = 'f';
            }
        })
        let newTree = Object.assign({}, tree)
        updateTree(newTree);
        updateCard(newCard);
        // TODO: optimize
        saveTree(newTree)
    }

    const selectTreeItemToRenameContext = () => {
        updateIsEditing(true);
        if (contextTreeItem) {
            let el = document.querySelector(`#tree-item-${contextTreeItem.id}`);
            selectElementContents(el);
        }
    }

    //TODO: not tested
    const selectTreeItemToRenameAfterCreation = (treeItem) => {
        updateIsEditing(true);
        updateContextTreeItem(treeItem)
        // new TreeItem isn't created immediately so I wait
        setTimeout(() => {
            selectTreeItemToRenameContext();
        }, 100);
    }

    const saveTreeContext = (newTree) => {
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
        // updateCard(null);
        renameTreeItem(newName, treeItemId, updateTree);
        tree.items[treeItemId].data.name = newName;     
        updateTree(Object.assign({}, tree));
    }

    const addDeckContext = async (parentId = contextTreeItem.id) => {
        if (!isDeck(tree.items[parentId])) {
            alert('Cannot make a deck from this type of item');
            return;
        }
        let newTree = await addDeck(parentId);
        updateTree(newTree);
    }

    const addItemContext = async (type, treeItem = contextTreeItem) => {
        console.warn({contextTreeItem});
        if (treeItem.data.type !== 'D') { 
            alert('Cannot make an item from this type of item');
            return;
        }
        let newTree = await addItem(treeItem.id, type);
        updateTreeAndAddParams(newTree);
    }

    const saveCardContext = (savedCard) => {
        updateCard(savedCard);
        saveCard(savedCard);
    }

    // TODO rename to set
    const setCardContext = async (id) => {
        // this little thing makes it possible to rerender EditorJs
        updateCard(null);
        let newCard = await getCard(id);
        console.log({newCard});
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

    let menuItems =  getContextMutations(
        addDeckContext, 
        addItemContext, 
        selectTreeItemToRenameContext,
        duplicateTreeItemContext,
        deleteTreeItemContext,
        toggleExpanded
    );

    return (
    <Collection.Provider value={{
        updateContextTreeItemAndCleanup,
        contextTreeItem,
        updateContextTreeItem,

        tree,
        updateTree,
        selectTreeItemToRenameContext,
        renameTreeItemContext,
        saveTreeContext,

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

        showSidebars, 
        updateShowSidebars,
        toggleExpanded,
        openTreeContextMenu,
        openAppContextMenu,
        hideContextMenu
        }}>
            {children}
            <ContextMenu menuItems={menuItems} appMenuItems={() => appMenuItems()} isAppMenuUsed={isAppMenuUsed}/>
            <HotkeyApp menuItems={menuItems}/>
    </Collection.Provider>)
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};