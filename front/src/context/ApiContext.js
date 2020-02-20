import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_CARD, SAVE_CARD, GET_BLOCKS, SAVE_BLOCKS, ADD_ITEM, 
    RENAME_BLOCK, DELETE_BLOCK, DUPLICATE_BLOCK, ADD_DECK, 
    GET_DUE_CARDS_IDS, ADVANCE_CARD
 } from '../api/queries';
import {CollectionProvider} from './CollectionContext'

export default function ApiContext({children}) {
    const [getCardQuery] = useMutation(GET_CARD);
    const [saveCardQuery] = useMutation(SAVE_CARD)
    const [saveBlocksQuery] = useMutation(SAVE_BLOCKS);

    const [addItemQuery] = useMutation(ADD_ITEM);

    const [renameBlockQuery] = useMutation(RENAME_BLOCK);
    const [deleteBlockQuery] = useMutation(DELETE_BLOCK);
    const [duplicateBlockQuery] = useMutation(DUPLICATE_BLOCK);
    const [addDeckQuery] = useMutation(ADD_DECK);
    const [advanceCardQuery] = useMutation(ADVANCE_CARD);

    const advanceCard = async (id, quality) => {
        let data = await advanceCardQuery({
            variables: {
                id,
                quality
            }
        });
        return data.data.advanceCard;
    }

    const duplicateBlock = async (blockId) => {
        let data = await duplicateBlockQuery({
            variables: {id: blockId}
        })
        return data.data.duplicateBlock;
    }
    
    const deleteBlock = async (blockId) => {
        let data = await deleteBlockQuery({
            variables: {id: blockId}
        });
        return data.data.deleteBlock;
    }
    
    const renameBlock = async (newName, blockId) => {
        let data = renameBlockQuery({variables: {
            id: blockId,
            newName: newName
        }})
        // return data.data.renameBlock;
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
    
    const addItem =  async (blockId, type) => {
        let data = await addItemQuery({
            variables: {
                type,
                parentId: blockId
            }
        })
        console.error("addItem data", data);
        return data.data.addItem;
    }
    
    const saveBlocks = (newBlocks) => {
        saveBlocksQuery({
            variables: {"newBlocks": newBlocks}
        }).then((data) => {
            console.log("saveBlocks data", data)
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
            duplicateBlock={duplicateBlock}
            deleteBlock={deleteBlock}
            addDeck={addDeck}
            addItem={addItem}
            saveCard={saveCard}
            renameBlock={renameBlock}
            getCard={getCard}
            saveBlocks={saveBlocks}
            getDueCardsIds={getDueCardsIds}
            advanceCard={advanceCard}
            >
            {children}
        </CollectionProvider>)
}
