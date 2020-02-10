import React, {useState, useEffect} from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import {useLocation} from 'react-router-dom';

import Entry from '../components/Editor/Entry';
import HotkeysEditor from '../components/Editor/HotkeysEditor';

export default function Editor() {    
    const [editorChanged, updateEditorChanged] = useState(false);
    const [entriesEditors, updateEntriesEditors] = useState(null);
    let linkState = useLocation().state
    let block = linkState ? linkState.block : null
    
    useEffect(() => {
        updateEntriesEditors(new Array())
    }, [block]);

    
    if (!block || !block.id) {
        return (<div className="info">
                    <h1 className="title">( ･ิɷ･ิ)</h1>
                    <h2 className="subtitle"> You have chosen a dark path. <br />
                    No flashcard here..</h2>
                </div>)
    }

    
   
return (<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryContext,
        chooseTypeC, card, isCardUpdating, saveCardServer,
        findLastDeck
    }) => {
        
    if(!card || isCardUpdating) {
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    const deckParent = findLastDeck(block);
    
    const deck_title = deckParent.data.name;
    
    const saveCard = async () => { 
        updateEditorChanged(false);
        console.log("those editors!!", entriesEditors)
        entriesEditors.map( async ({entry, instance}) => {
            console.log("instance", instance);
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardServer(await Object.assign({}, card))
    }

    const addNewEntry = (cardId) => {
        addNewEntryContext(cardId)
    }

    const saveEditorInstance = (instance, entry) => {
        if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            
        }
        console.log("S!!! entries_editors", entriesEditors);
    }

    // it works for some reason
    const deleteEntryEditor = (id) => {
        deleteEntryContext(id);
        updateEntriesEditors(entriesEditors.filter(eE => eE.entry.id != id));
        setTimeout(() => {
            console.log("entries editors", entriesEditors);
        }, 300);
        
    }

    const chooseType = (entryId, type) => {
        chooseTypeC(block.id, entryId, type);
    }

    return (
        <div className="editor" >
            < HotkeysEditor saveCard={saveCard} />
            <div className="editor__header">
                <div className="editor__header-left">
                    <div className="editor__subtitle text-blue-bright"> Deck </div>
                    <div className="editor__title text-dark">
                        {deck_title}
                    </div>
                </div>
                <div className="editor__header-right">
                    <div className="editor__subtitle text-blue-bright"> Template </div>
                    <div className="editor__title text-dark">
                        {template_title}
                    </div>
                </div>
            </div>
            <div className="editor__entries">
                {   entries && entriesEditors ?
                    entries.map(e => (
                        <Entry e={e} key={`${block.id}${e.id}`}
                        blockId={block.id}
                        saveEditorInstance={saveEditorInstance}
                        deleteEntryEditor={deleteEntryEditor}
                        chooseType={chooseType}
                        editorChanged={editorChanged}
                        updateEditorChanged={updateEditorChanged}
                        />
                    )) : "Hmm, a card is empty. Strange..."
                }
            </div>
            <div className="editor__actions">
                <div onClick={() => addNewEntry(card.id)}className="btn btn-circ btn-plus-minus">+</div>
                <div onClick={() => saveCard()} className="btn btn-text">Save{editorChanged ? "*": ""}</div>
                
            </div>
        </div>
    )
    }
    }
</CollectionConsumer>)
}
