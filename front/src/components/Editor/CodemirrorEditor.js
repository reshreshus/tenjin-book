import React from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';

export default function CodemirrorEditor({source, onEditorChange}) {
    return (
        <CodeMirror
            value={source}
            className="codemirror-custom"
            options={{
                mode: 'gfm',
                // theme: '',
                lineNumbers: false,
                lineWrapping: true,
            }}
            onChange={(editor, data, value) => {
                onEditorChange(value);
            }}
        />
    )
}
