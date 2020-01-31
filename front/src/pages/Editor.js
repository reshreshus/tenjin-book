import React, {useState} from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import {useLocation} from 'react-router-dom';

import Entry from '../components/Editor/Entry';

export default function Editor() {    
    const [editorChanged, updateEditorChanged] = useState(false);
    const [entriesEditors, updateEntriesEditors] = useState(new Array());

    let linkState = useLocation().state
    let block = linkState ? linkState.block : null
    if (!block || !block.id) {
        return (<div className="info">
                    <h1 className="title">( ･ิɷ･ิ)</h1>
                    <h2 className="subtitle"> You have chosen a dark path. <br />
                    No flashcard here..</h2>
                </div>)
    }
    
   
return (<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryContext,
        chooseTypeC, getCard, card, isCardUpdating, saveCardServer
    }) => {
        
    if(!card) {
        if (!isCardUpdating) {
            getCard(block.id)
        }
        return <div>loading</div>
    }
    const {deck_title, template_title, entries} = card;
    
    const saveCard = async () => { 
        console.log("entriesEditors", entriesEditors)
        updateEditorChanged(false);
        entriesEditors.map( async ({entry, instance}) => {
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardServer(await Object.assign({}, card))
    }

    const addNewEntry = (cardId) => {
        console.log("adding new entry")
        addNewEntryContext(cardId)
    }

    const saveEditorInstance = (instance, entry) => {
        if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            
        }
        // console.log("S!!! entries_editors", entriesEditors);
    }

    const deleteEntry = (id) => {
        deleteEntryContext(card.id, id)
    }

    const chooseType = (entryId, type) => {
        chooseTypeC(card.id, entryId, type);
    }

    return (
        <div className="editor">
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
                    entries.map((e, i) => (
                        <Entry e={e} key={i} idx={i} 
                        saveEditorInstance={(saveEditorInstance)}
                        deleteEntry={deleteEntry}
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
