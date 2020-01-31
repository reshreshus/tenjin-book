import React, {useState} from 'react'
import HotkeyApp from './HotkeyApp';
import ContextMenu from '../components/ContextMenu';
import { selectElementContents, disableEditable,
         enabeEditable, removeSelections, 
         openContextMenu, hideContextMenu } from './domHelpers'
import { blocks_import, cards_import } from './defaultData';
import { GET_CARD, ADD_CARD_ENTRY, SAVE_CARD, GET_BLOCKS } from './queries';
import { useMutation, useQuery } from '@apollo/react-hooks';

const Collection = React.createContext();

function CollectionProvider({children}) {
    const [blocks, updateBlocks] = useState(null)
    const [cards, updateCards] = useState(cards_import);    
    // TODO
    const [blocksNumber, updateBlocksNumber] = useState(6);
    const [selectedBlockId, updateSelectedBlockId] = useState('');
    

    const [contextBlock, updateContextBlock] = useState(null);
    const [showSidebars, updateShowSidebars] = useState([true, true])

    const [getCardQuery] = useMutation(GET_CARD);
    const [isCardUpdating, updateIsCardUpdating] = useState(false);

    const [saveCardQuery] = useMutation(SAVE_CARD)

    const {data: blocksData, loading: blocksLoading, error: blocksError} = useQuery(GET_BLOCKS,
        {
            onCompleted:  () => { console.log("blocksData", blocksData); updateBlocks(blocksData.blocks) }
        });

    const [card, updateCard] = useState(null);

    const updateBlockName = (blockId) => {
        console.log("updateBlockName")
    }

    const updateSelectedBlockIdAndCleanup = (id, blockRef) => {
        removeSelections();
        hideContextMenu();
        let el = blockRef.current.querySelector('.content-editable');
        disableEditable(el);
        updateSelectedBlockId(id);
    }

    const saveCardServer = (savedCard) => {
        updateCard(savedCard);
        console.log("saveCardServer entries", card.entries);
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

    const addNewEntryContext = (cardId) => {
        console.log("cardId", cardId);
        let newEntry = {
            name:"New Entry", 
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "" }
                }]
            }, 
            entry_type:"C",
            id: card.entries.length
        }
        let newCard = Object.assign({}, card)
        newCard.entries.push(newEntry)
        updateCard(newCard)
    }

    const deleteEntryContext = (cardId, entryId) => {
        let card = cards.filter(c => c.id === cardId)[0];
        let idx = cards.indexOf(card);
        card.entries.splice(entryId, 1)
        card.entries.map((e) => {
            if (e.entry_id > entryId) {
                e.entry_id--;
            }
        })
        let newCards = cards;
        newCards[idx] = card;
        updateCards([...newCards]);
    }

    const chooseTypeC = (cardId, entryId, type) => {
        console.log("chooseType Context")
    }

    const getBlock = (id) => {
        return blocks.filter (d => d.id === id)[0]
    } 

    const addNewBlock = (previousBlockId = -1, isParent=false) => {
        let newBlocksNumber = String(blocksNumber + 1);
        if (previousBlockId < 0) {
            blocks.push({
                "id": String(newBlocksNumber),
                "name": "New Deck",
                "type": "D",
            })
             // edit new block immediately upon creating it
            updateBlocks([...blocks]);
            hideContextMenu();
            updateSelectedBlockId(newBlocksNumber)
            // new Block isn't created immediately so I wait
            setTimeout(() => {
                let el = document.querySelector(`.block-${newBlocksNumber}`);
                enabeEditable(el)
                selectElementContents(el);
            }, 100);
            updateBlocksNumber(blocksNumber + 1)
            
        } else {
            console.log("this kind of adding not implemented yet")
        }
    }

    

    const getCard = (id) => {
        updateIsCardUpdating(true);
        getCardQuery({
            variables: {id: id}
        }).then((data) => {
            console.log("cardData", data)
            let newCard = data.data.card;
            console.log("type of newCard.entries", typeof newCard.entries)
            updateCard(newCard);
            updateIsCardUpdating(false);
            return newCard;
        });        
    }

    return (
        <Collection.Provider value={{
                cards,
                blocks,
                getBlock,
                addNewEntryContext,
                deleteEntryContext,
                chooseTypeC,
                selectedBlockId,
                updateSelectedBlockIdAndCleanup,
                updateSelectedBlockId,
                addNewBlock,
                getCard,
                updateBlockName,
                openContextMenu,
                hideContextMenu,
                card,
                isCardUpdating,
                saveCardServer,
                updateContextBlock
        }}>
            {children}
            <ContextMenu block={contextBlock} />
            <HotkeyApp selectedBlockId={selectedBlockId} showSidebars={showSidebars}
             updateShowSidebars={updateShowSidebars}/>
        </Collection.Provider>)
    
}

const CollectionConsumer = Collection.Consumer;
export {CollectionProvider, CollectionConsumer};