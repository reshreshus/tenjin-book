import React from 'react'
import { useMutation } from '@apollo/react-hooks';
import { GET_CARD, SAVE_CARD, SAVE_TREE, ADD_ITEM,
    RENAME_TREE_ITEM, DELETE_TREE_ITEM, DUPLICATE_TREE_ITEM, ADD_DECK,
    ADVANCE_CARD, GET_ITEMS
 } from '../api/queries';
import {CollectionProvider} from './CollectionContext'

export default function ApiContext({children}) {
    const [getCardQuery] = useMutation(GET_CARD);
    const [saveCardQuery] = useMutation(SAVE_CARD)
    const [saveTreeQuery] = useMutation(SAVE_TREE);

    const [getTreeQuery] = useMutation(GET_ITEMS);

    const [addItemQuery] = useMutation(ADD_ITEM);

    const [renameTreeItemQuery] = useMutation(RENAME_TREE_ITEM);
    const [deleteTreeItemQuery] = useMutation(DELETE_TREE_ITEM);
    const [duplicateTreeItemQuery] = useMutation(DUPLICATE_TREE_ITEM);
    const [addDeckQuery] = useMutation(ADD_DECK);
    const [advanceCardQuery] = useMutation(ADVANCE_CARD);

    const getItems = async () => {
        let data = await getTreeQuery();
        return data.data.items;
    }

    const advanceCard = async (id, quality) => {
        let data = await advanceCardQuery({
            variables: {
                id,
                quality
            }
        });
        return data.data.advanceCard;
    }

    const duplicateTreeItem = async (treeItemId) => {
        let data = await duplicateTreeItemQuery({
            variables: {id: treeItemId}
        })
        return data.data.duplicateTreeItem;
    }

    const deleteTreeItem = async (treeItemId) => {
        let data = await deleteTreeItemQuery({
            variables: {id: treeItemId}
        });
        return data.data.deleteTreeItem;
    }

    const renameTreeItem = async (newName, treeItemId) => {
        let data = renameTreeItemQuery({variables: {
            id: treeItemId,
            newName: newName
        }})
        // return data.data.renameTreeItem;
    }

    const addDeck = async (parentId) => {
        let data = await addDeckQuery({
            variables: {
                parentId
            }
        })
        console.error("addDeck data", data);
        return data.data.addDeck;
    }

    const addItem =  async (treeItemId, type) => {
        let data = await addItemQuery({
            variables: {
                type,
                parentId: treeItemId
            }
        })
        return data.data.addItem;
    }

    const saveTree = (newTree) => {
        saveTreeQuery({
            variables: {"newTree": newTree}
        }).then((data) => {
            console.log("saveTree data", data)
        })
    }

    const saveCard = (savedCard) => {
        // TODO: WTF I need to understand why this works
        // looks like saveCardQuery works with an old version of savedCard (or card in state)
        setTimeout(() => {
            saveCardQuery({
                variables: savedCard
            }).then((data) => {
                console.log("savecard data", data)
            })
        }, 100)
    }

    const getCard = async (id) => {
        let data = await getCardQuery({
            variables: {id: id}
        })
        return data.data.card;
    }

    return (
        <CollectionProvider
            duplicateTreeItem={duplicateTreeItem}
            deleteTreeItem={deleteTreeItem}
            addDeck={addDeck}
            addItem={addItem}
            saveCard={saveCard}
            renameTreeItem={renameTreeItem}
            getCard={getCard}
            saveTree={saveTree}
            advanceCard={advanceCard}
            getItems={getItems}
            >
            {children}
        </CollectionProvider>)
}
