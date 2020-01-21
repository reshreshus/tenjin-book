import React, {useState} from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editorJsTools'  

export default function Editor() {
   
return (<CollectionConsumer >
    { ({card, updateCardEntries, addNewEntryContext, deleteEntryContext}) => {
    const {deck_title, template_title, entries} = card;
    const entries_editors = new Array(entries.length)
    
    const saveCardEntries = async () => { // TODO: You can utilize smart way of changing stuff like github
        const newCardEntries = []
        entries_editors.map(async (editor) => {
            const savedData = await editor.save();
            newCardEntries.push([...savedData.blocks])
        })
        const changes = {
            "newCardEntries": newCardEntries
        }
        updateCardEntries(card.id, changes);
    }

    const addNewEntry = () => {
        console.log("adding new entry")
        addNewEntryContext(card.id)
    }

    const deleteEntry = (entryId) => {
        deleteEntryContext(card.id, entryId)
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
                {   entries ?
                    entries.map((e, i) => (
                        <div className="card-entry" key={i}>
                            <div className="card-entry__qa btn btn-circ">
                            {
                                e.isQuestion ? 
                                "Q" : "A"
                            }
                            </div>
                            <div className="" className="text-field" 
                                id={"editor-js-" + e.entry_id}>
                                <EditorJs 
                                    instanceRef={instance => entries_editors[i] = instance}
                                    tools={EDITOR_JS_TOOLS}
                                    holder={"editor-js-" + e.entry_id}
                                />
                            </div>
                            <div onClick={() => deleteEntry(e.entry_id)} className="btn btn-circ btn-plus-minus">-</div>
                        </div>
                    )) : "Hmm, a card is empty. Strange..."
                }
            </div>
            <div className="editor__actions">
                <div onClick={() => addNewEntry()}className="btn btn-circ btn-plus-minus">+</div>
                <div onClick={() => saveCardEntries()} className="btn btn-primary">Save</div>
            </div>
        </div>
    )
    }
    }
</CollectionConsumer>)
}
