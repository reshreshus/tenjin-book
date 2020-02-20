import React from 'react'
import Entry from './Entry';
import CardEvaluation from './CardEvaluation';
import { getEvaluationOptions } from './sm2';

export default function RepeatEntires({entries, saveEditorInstance, updateEditorChanged, 
    entriesEditors, treeItemId,
    isQuestioning, updateIsQuestioning, editingMode, toggleEditing, treeItem,
    advanceCardContext
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
        return <Entry e={e} key={`${treeItemId}${e.id}`}
        saveEditorInstance={saveEditorInstance}
        updateEditorChanged={updateEditorChanged}
        />
    }
    
    return (
        <div>
                {   entries && entriesEditors ?
                    <div className="repeat-entries">  
                        {
                            questions.map(e => (
                            repeatEntry(e)
                            ))
                        }
                        <div className={isQuestioning? 'hide': ''} style={{width: '100%'}}> 
                            {
                                answers.map(e => (
                                repeatEntry(e)
                                ))
                            }
                        </div>
                        {
                            isQuestioning ? 
                            <div onClick={() => updateIsQuestioning(false)}
                            className="repeat-entries__show-answer btn-contrast"> Show answer </div>
                            :
                            <CardEvaluation toggleEditing={toggleEditing} evalutionOptions={getEvaluationOptions(treeItem, advanceCardContext)}
                            editingMode={editingMode} updateIsQuestioning={updateIsQuestioning}/>     
                        }
                        
                        

                    </div>
                     

                    : "Hmm, a card is empty. Strange..."
                }
            </div>
    )
}
