import React, {useState} from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

import Entry from '../components/Editor/Entry';

export default function Editor() {
    
   
return (<CollectionConsumer >
    { ({card, updateCardEntries, addNewEntryContext, deleteEntryContext,
        chooseTypeC
    }) => {
    const {deck_title, template_title, entries} = card;
    const entries_editors = new Array(entries.length)
    
    const saveCardEntries = async () => { 
        // TODO: You can utilize smart way of changing stuff like github
        const newCardEntries = []
        entries_editors.map(async (editor) => {
            const savedData = await editor.save();
            newCardEntries.push([...savedData.blocks])
        })
        const changes = {
            "newCardEntries": newCardEntries
        }
        console.log("newCardEntries", newCardEntries);
        updateCardEntries(card.id, changes);
    }

    const addNewEntry = () => {
        console.log("adding new entry")
        addNewEntryContext(card.id)
    }

    const saveEditorInstance = (instance, idx) => {
        entries_editors[idx] = instance
    }

    const deleteEntry = (entryId) => {
        deleteEntryContext(card.id, entryId)
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
                {   entries ?
                    entries.map((e, i) => (
                        <Entry e={e} key={i} idx={i} 
                        saveEditorInstance={saveEditorInstance}
                        deleteEntry={deleteEntry}
                        chooseType={chooseType}
                        />
                    )) : "Hmm, a card is empty. Strange..."
                }
            </div>
            <div className="editor__actions">
                <div onClick={() => addNewEntry()}className="btn btn-circ btn-plus-minus">+</div>
                <div onClick={() => saveCardEntries()} className="btn btn-text">Save</div>
            </div>
        </div>
    )
    }
    }
</CollectionConsumer>)
}
