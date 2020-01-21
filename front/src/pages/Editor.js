import React, {useState} from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './editorJsTools'  

export default function Editor() {
   
return (<CollectionConsumer >
    { (value) => {
        // console.log("card", value.card);
        const {deck_title, template_title, entries} = value.card;
        const entries_editors = new Array(entries.length)
        const handleSave = async () => {
            entries_editors.map(async (editor) => {
                const savedData = await editor.save();
                console.log("savedData", savedData);
            })
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
                            // <CardEntry key={i} data={e} isSaving={isSaving}/>
                            <div className="card-entry" key={i}>
                                <div className="card-entry__qa btn btn-circ">
                                {
                                    e.isQuestion ? 
                                    "Q" : "A"
                                }
                                </div>
                                {/* <TextField data={data} id={data.entry_id} isSaving={isSaving}/> */}
                                <div className="" className="text-field" 
                                    id={"editor-js-" + e.entry_id}>
                                    <EditorJs 
                                        instanceRef={instance => entries_editors[i] = instance}
                                        tools={EDITOR_JS_TOOLS}
                                        holder={"editor-js-" + e.entry_id}
                                    />
                                </div>
                                <div className="btn btn-circ btn-plus-minus">-</div>
                            </div>
                        )) : "Hmm, a card is empty. Strange..."
                    }
                </div>
                <div className="editor__actions">
                    <div className="btn btn-circ btn-plus-minus">+</div>
                    <div onClick={() => handleSave()} className="btn btn-primary">Save</div>
                </div>
            </div>
        )
        }
    }
</CollectionConsumer>)
}
