import React, { useState } from 'react'
import MarkdownRender from './MarkdownRender'
import CodemirrorEditor from './CodemirrorEditor'

export default function EntryMarkdown({e, isPreview}) {
    const [source, updateSource] = useState(e.content);

    const onEditorChange = (value) => {
        updateSource(value);
    }

    return (
        <div className="card-entry__text-field">
            {
                isPreview ?
                <MarkdownRender className="editor_render" source={source}/>
                :
                <CodemirrorEditor className="editor_codemirror" source={source} onEditorChange={onEditorChange} />
            }
            
        </div>
    )
}
