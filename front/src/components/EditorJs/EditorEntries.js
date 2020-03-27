import React from 'react'
import Entry from './Entry';
import MarkdownEntry from './MarkdownEntry';

export default function EditorEntries({entries, entriesEditors, 
    saveEditorInstance, deleteEntryEditor, 
    chooseType, updateEditorChanged, editorChanged}) {
    return (
        <div className="editor__entries">
                {   entries && entriesEditors ?
                    entries.map(e => (
                        (e.format === 'markdown') ?
                        <MarkdownEntry e={e} key={e.key}/>
                        :
                        <Entry e={e} key={e.key}
                        saveEditorInstance={saveEditorInstance}
                        deleteEntryEditor={deleteEntryEditor}
                        chooseType={chooseType}
                        editorChanged={editorChanged}
                        updateEditorChanged={updateEditorChanged}
                        />
                    )) : "Hmm, a card is empty. Strange..."
                }
            </div>
    )
}
