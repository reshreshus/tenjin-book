import React from 'react'
import Entry from './Entry';

export default function EditorEntries({entries, entriesEditors,
  saveEditorInstance, deleteEntryEditor,
  chooseType, updateEditorChanged, editorChanged,
  onMarkdownEntryChange, updateEntryFormat}) {
  return (
    <div className="editor__entries">
        {   entries && entriesEditors ?
          entries.map(e => (
            <Entry e={e} key={e.key}
            saveEditorInstance={saveEditorInstance}
            deleteEntryEditor={deleteEntryEditor}
            chooseType={chooseType}
            editorChanged={editorChanged}
            updateEditorChanged={updateEditorChanged}
            onMarkdownEntryChange={onMarkdownEntryChange}
            updateEntryFormat={updateEntryFormat}
            />
          )) : "Hmm, a card is empty. Strange..."
        }
      </div>
  )
}
