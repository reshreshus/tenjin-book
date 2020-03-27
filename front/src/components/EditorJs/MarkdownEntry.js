import React, { useState } from 'react'
import MarkdownRender from './MarkdownRender'
import CodemirrorEditor from './CodemirrorEditor'

export default function MarkdownEntry({e}) {
    const [source, updateSource] = useState(e.content);
    const [isPreview, updateIsPreview] = useState(false);

    const onEditorChange = (value) => {
        updateSource(value);
    }

    return (
        <div className="editor">
            <div className="editor__btn btn btn-primary" onClick={() => updateIsPreview(!isPreview)}> switch</div>
            {
                isPreview ?
                <MarkdownRender className="editor_render" source={source}/>
                :
                <CodemirrorEditor className="editor_codemirror" source={source} onEditorChange={onEditorChange} />
            }
            
        </div>
    )
}
