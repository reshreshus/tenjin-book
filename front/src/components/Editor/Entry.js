import React, {useState, useEffect} from 'react'

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editorJsTools' 

export default function Entry({e, saveEditorInstance, chooseType,
    editorChanged, updateEditorChanged, deleteEntryEditor
}) {
    const [isChoosingType, updateChoosingType] = useState(false);
    const [isChanged, updateIsChanged] = useState(false);
    useEffect(() => {
        if (!editorChanged) {
            updateIsChanged(false);
        }
        console.log("aaaaaaaaaa")
    }, [editorChanged])

    const updateAreChanged = () => {
        console.log("updateIsChanged")
        updateIsChanged(true);
        updateEditorChanged(true);
    }
    
    const openChoosingType = () => {
        console.log("openChoosingType")
        updateChoosingType(true)
    }

    const closeChoosingType = () => {
        console.log("closeChoosingType")
        updateChoosingType(false)
    }

    const deleteEntry = () => {
        updateAreChanged();
        deleteEntryEditor(e.id);
    }

    return (
        <div className="card-entry" >
            <div className="card-entry__header">
                {console.log("editorChanged", editorChanged)}
                <div className={`card-entry__choose-type ${isChoosingType ? "": "hide"}`}>
                    {
                        ['A', 'Q', 'C'].map((type, i) => (
                            <div key={i} 
                                className={`btn ${type===e.entry_type ? 
                                    'btn-circ' : ''}`}
                                onClick={()=> 
                                    {
                                        closeChoosingType();
                                        chooseType(e.id, type);
                                        
                                    }}
                                >
                                { type }
                            </div>
                    ))
                    }
                </div>
                
                <div onClick={() => {
                    openChoosingType(e.id)
                }}
                className={`card-entry__qa btn-circ ${isChoosingType ? "hide": ""}`}> { e.entry_type }
                </div>
                
                <div className="card-entry__name">
                    {
                        e.name
                    }
                </div>
                {isChanged ? "*" : ""}
            </div>

            <div className="card-entry__field">
                <div className="card-entry__text-field" 
                    id={"editor-js-" + e.id}>
                        {
                            console.log("e.content", e.content)
                        }
                    <EditorJs 
                        instanceRef={instance => {
                            saveEditorInstance(instance, e);
                        }}
                        tools={EDITOR_JS_TOOLS}
                        holder={"editor-js-" + e.id}
                        data={e.content}
                        onChange={() => {
                            updateAreChanged();
                        }}
                    />
                </div>
                <div onClick={() => deleteEntry()} className="btn-circ btn-plus-minus">-</div>
            </div>
        </div>
    )
}
