import React from 'react'
import MarkdownRender from './MarkdownRender'
import CodemirrorEditor from './CodemirrorEditor'

export default function EntryMarkdown({source, isPreview, onChange}) {

    return (
        <div className="card-entry__text-field">
            {
                isPreview ?
                <MarkdownRender className="editor_render" source={source}/>
                :
                <CodemirrorEditor className="editor_codemirror" source={source} onEditorChange={onChange} />
            }
        </div>
    )
}
