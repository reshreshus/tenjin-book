import React, {useState, useEffect} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';

import { GET_TREE} from '../api/queries';
import { useQuery } from '@apollo/react-hooks';

import { selectElementContents, removeSelections, 
         openContextMenu, hideContextMenu } from '../helpers/domHelpers'
import {getContextMutations} from './ContextMutations';


const Collection = React.createContext();

function CollectionProvider({children, 
    duplicateTreeItem, 
    deleteTreeItem,
    addDeck,
    addItem,
    saveCard,
    renameTreeItem,
    getCard,
    savetree,
    advanceCard}) 
    {
    const [tree, updateTree] = useState(null) 
    const [contextTreeItem, updateContextTreeItem] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true]);
    const [isEditing, updateIsEditing] = useState(false);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);
    const [card, updateCard] = useState(null);


    const [currentlyUsedDeck, updateCurrentlyUsedDeck] = useState();
    const [dueCardsIds, updateDueCardsIds] = useState();

    const [editingMode, updateEditingMode] = useState({
        isStudying: false, // study or preview
        isEditing: true
    })

    const {data: treeData, loading: treeLoading, error: treeError} = useQuery(GET_TREE,
        {
            // TODO: query executes an unusual number of times
            onCompleted:  () => { 
                console.log(treeData.tree); 
                
                let tree = calculateDueItemsInTree(treeData.tree);
                updateTree(tree);
            }
        });

    

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

    const advanceCardContext = (deckId=currentlyUsedDeck.id, cardId, quality) => {
        advanceCard(cardId, quality);
        if (deckId === currentlyUsedDeck.id) {
            let newDueCardsIds = dueCardsIds.filter(c => c.id !== cardId)
            updateDueCardsIds([...newDueCardsIds]);
        } else {
            // TODO
        }
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

    const isDue = (treeItem) => {
        let today = new Date();
        let nextDate = treeItem.data.repetitionStatsSm2.nextDate ;
        // TODO
        return nextDate === today || nextDate === '-1';
    }

    const calculateDueItemsInTreeItem = (parentItem, tree) => {
        
        if (!isRepeatableItem(parentItem)) {
            // dueItemsCount is calculated from descendents as well
            let dueItemsCount = 0;
            if (dueCardsChanged(parentItem)) {
                let dueItemsIds = []
                parentItem.children.map(childId => {
                    let childItem = tree.items[childId];
                    console.log("CHILD ITEM", childItem);
                    if (!isDeck(childItem)) {
                        if (isDue(childItem)) {
                            dueItemsIds.push(childId);
                        }
                    } else {
                        dueItemsCount += calculateDueItemsInTreeItem(childItem, tree);
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
                        dueItemsCount += calculateDueItemsInTreeItem(childItem, tree);
                    }
                });
                if (parentItem.data.dueItemsIds) {
                    dueItemsCount += parentItem.data.dueItemsIds.length;
                }
            }
            parentItem.data.dueItemsCount = dueItemsCount;
            return dueItemsCount;
        } else {
            console.error("calculating due items from non-deck element")
        }   
    }

    const calculateDueItemsInTree = (givenTree) => {
        
        let root = givenTree.items[givenTree.rootId];
        calculateDueItemsInTreeItem(root, givenTree);
        // updateTree(Object.assign({}, tree));
        return givenTree;
    }

    const recalculateTree = (treeItemsIds) => {

    }

    const getCardToRepeat = (deckTreeItem=currentlyUsedDeck) => {
        if (dueCardsIds) {
            return dueCardsIds[0];
        }
        let cardsIds = getCardsIdsOfDeck(deckTreeItem, true);
        updateDueCardsIds(cardsIds);
        console.log("cardsIds", cardsIds);
        return cardsIds[0]
    }

    const findLastDeck = (treeItem) => {
        // base case
        if (isDeck(treeItem)) {
            return treeItem;
        }

        let parent = tree.items[treeItem.parentId];
        if (!parent) {
            console.error("couldn't find a parent");
            return;
        }
        // if (parent.data.type === 'D') return parent
        return findLastDeck(parent);
    }

    const toggleExpanded = (treeItemId) => {
        let treeItem = tree.items[treeItemId];
        treeItem.isExpanded = !treeItem.isExpanded;
        updateTree(Object.assign({}, tree))
    }

    const updateContextTreeItemAndCleanup = (treeItem, treeItemRef) => {
        removeSelections();
        hideContextMenu();
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

    const chooseTypeC = (cardId, entryId, type) => {
        let newCard = Object.assign({}, card);
        let entry = newCard.entries.filter(e => e.id === entryId)[0]
        entry.type = type;
        tree.items[cardId].data.type = 'T'
        newCard.entries.map(e => {
            if (e.type === 'Q') {
                tree.items[cardId].data.type = 'f';
            }
        })
        updateTree(Object.assign({}, tree));
        updateCard(newCard);
        
    }

    const selectTreeItemToRenameContext = () => {
        updateIsEditing(true);
        if (contextTreeItem) {
            let el = document.querySelector(`#treeItem-${contextTreeItem.id}`);
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

    const savetreeContext = async (newtree) => {
        savetree(newtree);
        updateTree(newtree);
    }

    const duplicateTreeItemContext = async (treeItemId) => {
        let tree = await duplicateTreeItem(treeItemId);
        updateTree(tree);
    }

    const deleteTreeItemContext = async (treeItemId) => {
        let tree = await deleteTreeItem(treeItemId);
        updateTree(tree);
    }

    const renameTreeItemContext = async (newName, treeItemId) => {
        // updateCard(null);
        renameTreeItem(newName, treeItemId, updateTree);
        tree.items[treeItemId].data.name = newName;     
        updateTree(Object.assign({}, tree));
    }

    const addDeckContext = async (parentId) => {
        if (!isDeck(tree.items[parentId])) {
            alert('Cannot make a deck from this type of item');
            return;
        }
        let newtree = await addDeck(parentId);
        updateTree(newtree);
    }

    const addItemContext = async (treeItem, type) => {
        console.error("addItemContext");
        if (treeItem.data.type !== 'D') {
            alert('Cannot make an item from this type of item');
            return;
        }
        updateTree(await addItem(treeItem.id, type));
    }

    const saveCardContext = (savedCard) => {
        updateCard(savedCard);
        saveCard(savedCard);
    }

    const getCardContext = async (id) => {
        updateIsCardUpdating(true);
        let newCard = await getCard(id);
        updateCard(newCard);
        updateIsCardUpdating(false);
    }

    const menuItems = getContextMutations(
        addDeckContext, 
        addItemContext, 
        selectTreeItemToRenameContext,
        duplicateTreeItemContext,
        deleteTreeItemContext,
        toggleExpanded,
        contextTreeItem
    );

    return (
    <Collection.Provider value={{
            tree,
            addNewEntryContext,
            deleteEntryContext,
            chooseTypeC,
            updateContextTreeItemAndCleanup,
            getCardContext,
            openContextMenu,
            hideContextMenu,
            card,
            isCardUpdating,
            saveCardContext,
            updateContextTreeItem,
            showSidebars, 
            updateShowSidebars,
            updateTree,
            findLastDeck,
            contextTreeItem,
            isEditing, 
            updateIsEditing,
            selectTreeItemToRenameContext,
            renameTreeItemContext,
            menuItems,
            savetreeContext,
            getCardToRepeat,
            editingMode, 
            updateEditingMode,
            updateCurrentlyUsedDeck
        }}>
            {children}
            <ContextMenu />
            <HotkeyApp />
    </Collection.Provider>)
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};