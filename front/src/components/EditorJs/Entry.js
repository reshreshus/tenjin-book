import React, {useState, useEffect} from 'react'

import EditorJs from 'react-editor-js';
// import EditorJs from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './editorJsTools' 

export default function Entry({e, saveEditorInstance, chooseType,
    editorChanged, updateEditorChanged, deleteEntryEditor
}) {
    const [isChoosingType, updateChoosingType] = useState(false);
    const [isChanged, updateIsChanged] = useState(false);

    console.log({e})
    // const [editor, updateEditor] = useState(new EditorJs({
    //     data: e.content,
    //     tools: EDITOR_JS_TOOLS,
    //     onChange:() => {
    //         updateAreChanged();
    //     },
    //     holderId: "editor-js-" + e.key,

    // }));
    // useEffect(() => {
    //     editor.render(e.content);   
    // });
    // saveEditorInstance(editor, e);

    useEffect(() => {
        if (!editorChanged) {
            updateIsChanged(false);
        }
    }, [editorChanged])


    const updateAreChanged = () => {
        updateIsChanged(true);
        updateEditorChanged(true);
    }
    
    const openChoosingType = () => {
        updateChoosingType(true)
    }

    const closeChoosingType = () => {
        updateChoosingType(false)
    }

    const deleteEntry = () => {
        updateAreChanged();
        deleteEntryEditor(e.id);
    }

    

    return (
        <div className="card-entry" >
            <div className="card-entry__header">
                <div className={`card-entry__choose-type ${isChoosingType ? "": "hide"}`}>
                    {
                        ['A', 'Q', 'C'].map((type, i) => (
                            <div key={i} 
                                className={`btn ${type===e.type ? 
                                    'btn-circ' : ''}`}
                                onClick={()=> 
                                    {
                                        closeChoosingType();
                                        if (e.type !== type) {
                                            updateAreChanged();
                                            chooseType(e.id, type);
                                        }
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
                className={`card-entry__qa btn-circ ${isChoosingType ? "hide": ""}`}> { e.type }
                </div>
                
                <div className="card-entry__name">
                    {
                        e.name
                    }
                </div>
                {isChanged ? "*" : ""}
            </div>

            <div className="card-entry__field">
               
                    <EditorJs 
                        // enableReInitialize={true}
                        // autofocus={e.id === 0}
                        key={e.key}
                        instanceRef={instance => {
                            saveEditorInstance(instance, e);    
                        }}
                        tools={EDITOR_JS_TOOLS}
                        holder={"editor-js-" + e.key}
                        data={e.content}
                        onChange={() => {
                            updateAreChanged();
                        }}
                    >
                        <div className="card-entry__text-field" 
                            id={"editor-js-" + e.key}></div>

                    </EditorJs>
                
                <div onClick={() => deleteEntry()} className="btn-circ btn-plus-minus">-</div>
            </div>
        </div>
    )
}
