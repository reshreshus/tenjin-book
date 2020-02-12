import React from 'react'
import Entry from './Entry';

export default function RepeatEntires({entries, saveEditorInstance, updateEditorChanged, 
    entriesEditors, blockId,
    isQuestioning, updateIsQuestioning
    }) {
    let questions = []
    let answers = []
    entries.map(e => {
        if (e.type === 'Q') {
            questions.push(e)
        } else if (e.type === 'A') {
            answers.push(e);
        }
    })

    const repeatEntry = (e) => {
        return <Entry e={e} key={`${blockId}${e.id}`}
        saveEditorInstance={saveEditorInstance}
        updateEditorChanged={updateEditorChanged}
        />
    }
    
    return (
        <div className="repeat-entries">
                {   entries && entriesEditors ?
                    <div>  
                        {
                            questions.map(e => (
                            repeatEntry(e)
                            ))
                        }
                        {
                            isQuestioning ? 
                            <div onClick={() => updateIsQuestioning(false)}
                            className="repeat-entries__show-answer btn-contrast"> Show answer </div>
                            :
                            answers.map(e => (
                            repeatEntry(e)
                            ))
                        }
                        

                    </div>
                     

                    : "Hmm, a card is empty. Strange..."
                }
            </div>
    )
}
