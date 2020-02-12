import React from 'react'
import Entry from './Entry';

export default function RepeatEntires({entries, saveEditorInstance, updateEditorChanged, 
    entriesEditors, blockId}) {
    let questions = []
    let answers = []
    entries.map(e => {
        if (e.type === 'Q') {
            questions.push(e)
        } else if (e.type === 'A') {
            answers.push(e);
        }
    })
    
    return (
        <div className="editor__repeat-entries">
                {   entries && entriesEditors ?
                    entries.map(e => (
                        <Entry e={e} key={`${blockId}${e.id}`}
                        saveEditorInstance={saveEditorInstance}
                        updateEditorChanged={updateEditorChanged}
                        />
                    )) : "Hmm, a card is empty. Strange..."
                }
            </div>
    )
}
