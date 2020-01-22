import React, {useState} from 'react'

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editorJsTools' 

export default function Entry({e, saveEditorInstance, idx}) {
    const [isChoosingType, updateChoosingType] = useState(false);

    return (
        <div className="card-entry" >
            <div className="card-entry__header">
                {
                    isChoosingType ? 
                    <div className="card-entry__choose-type">
                        {
                            ['A', 'Q', 'C'].map((type, i) => (
                                <div key={i} 
                                    className={`btn ${type===e.entry_type ? 
                                        'btn-circ' : ''}`}
                                    onClick={()=> {chooseType(e.entry_id, type)}}
                                    >
                                    { type }
                                </div>
                        ))
                        }
                    </div>
                    :
                    <div onClick={() => {openChoosingType(e.entryId)}}
                    className="card-entry__qa btn-circ"> { e.entry_type }
                    </div>
                }
                
                <div className="card-entry__name">
                    {
                        e.entry_name
                    }
                </div>
            </div>

            <div className="card-entry__field">
                <div className="card-entry__text-field" 
                    id={"editor-js-" + e.entry_id}>
                    <EditorJs 
                        instanceRef={instance => saveEditorInstance(instance, idx)}
                        tools={EDITOR_JS_TOOLS}
                        holder={"editor-js-" + e.entry_id}
                    />
                </div>
                <div onClick={() => deleteEntry(e.entry_id)} className="btn-circ btn-plus-minus">-</div>
            </div>
        </div>
    )
}
