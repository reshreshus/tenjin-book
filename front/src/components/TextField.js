import React from 'react'

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from './tools'

// const editor = new EditorJs({ 
//     holderId: 'text-field', 
//     tools: {  EDITOR_JS_TOOLS }, 
//   })
// const handleSave = async () => {
//     const savedData = await this.editorInstance.save();
//     console.log("savedData", savedData);
// }
    // instanceRef={instance => this.editorInstance = instance}
    // data={data} 
export default function TextField({data, id}) {
    return (
        <div className="" className="text-field" id={"editor-js-" + id}>
            <EditorJs 
                tools={EDITOR_JS_TOOLS}
                holder={"editor-js-" + id}
            />
        </div>
    )
}

// const saveDocument = () => {
//     editor.save().then((outputData) => {
//         console.log('Article data', outputData)
//     })
// }
