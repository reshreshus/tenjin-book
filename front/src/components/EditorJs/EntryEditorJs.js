import React from 'react';
import EditorJs from 'react-editor-js';
// import EditorJs from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './editorJsTools';

const EntryEditorJs = ({key, instanceRef, data, onChange}) => {
    return (
        <EditorJs 
            // enableReInitialize={true}
            // autofocus={e.id === 0}
            key={key}
            instanceRef={instanceRef}
            tools={EDITOR_JS_TOOLS}
            holder={"editor-js-" + key}
            data={data}
            onChange={onChange}
        >
            <div className="card-entry__text-field" 
                id={"editor-js-" + key}></div>

        </EditorJs>
    );
}

export default EntryEditorJs;
