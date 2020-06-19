import React, {useEffect, useState} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import { Redirect } from 'react-router';
import HotkeysEditor from './HotkeysEditor';
import EditorActions from './EditorActions';
import EditorEntries from './EditorEntries';
import EditorHeader from './EditorHeader';

import RepeatEntries from './Repeat/RepeatEntries';

const Editor = ({treeItem}) => {
  const [editorChanged, updateEditorChanged] = useState(false);
  const [editorJsEntries, updateEditorJsEntries] = useState(null);

  const editorEntries = []

  const [isQuestioning, updateIsQuestioning] = useState(true);

  useEffect(() => {
    updateEditorJsEntries([])
  }, [treeItem]);

  useEffect(() => {
    // console.error({editorChanged})
  }, [editorChanged])

  const onMarkdownEntryChange = (idx, value) => {
    editorEntries.filter(e => e.id === idx)[0].content = value;
    // updateMarkdownEntriesData([...markdownEntriesData])
  }

  const updateEntryFormat = (idx, format) => {
    console.error("updateEntryFormat")
    let entry = editorEntries.filter(e => e.id === idx)[0];
    if (entry.format === format) return;
    if (format === "markdown") {
      entry.content = ""
    } else {
      console.log("editorJS")
      entry.content = {
        "blocks": [
          {
            "type": "paragraph",
            "data": {
            "text": ""
            }
          },
        ]
      }
    }
    entry.format = format;
    updateEditorJsEntries(editorJsEntries.filter(e => e.entry.id !== idx));
    updateEditorChanged(true);
  }

  return (
<CollectionConsumer >
  { ({addNewEntryContext, deleteEntryContext,
    chooseTypeContext, card, saveCardContext, editingMode,
    updateEditingMode, advanceCardContext
  }) => {
  if (treeItem.data.type === 'D')  {
    return <Redirect push to='/show-deck' />
  }
  if(!card) {
    return <div>loading</div>
  } else {
    // console.warn({card})
  }
  const { entries } = card;
  editorEntries.length = 0;
  editorEntries.push(...entries)
  editorEntries.forEach(e => {
    e.key = `${e.id}${treeItem.id}`
  });

  const saveCard = async () => {
    updateEditorChanged(false);
    console.error('saveCard', editorChanged)
    console.log({editorJsEntries});
    const entryPromises = []
    const entries = []
    editorJsEntries.map( async ({entry, instance}) => {
      entryPromises.push(instance.save());
      entries.push(entry);
    })
    Promise.all(entryPromises).then((values) => {
      for (let i = 0; i < entries.length; i++) {
        entries[i].content.blocks = values[i].blocks;
      }
      saveCardContext(JSON.parse(JSON.stringify(card)))
    })
  }

  const saveEditorInstance = (instance, entry) => {
    editorJsEntries.push({
      "entry": entry,
      "instance": instance
    })
  }

  // it works for some reason
  const deleteEntryEditor = (id) => {
    deleteEntryContext(id);
    updateEditorJsEntries(editorJsEntries.filter(eE => eE.entry.id !== id));
    setTimeout(() => {
      console.log("entries editors", editorJsEntries);
    }, 300);
  }

  const chooseType = (entryId, type) => {
    chooseTypeContext(treeItem.id, entryId, type);
  }

  const toggleEditing = () => {
    updateEditingMode({
      ...editingMode,
      isEditing: !editingMode.isEditing
    });
  }

  return (
    <div className="editor">
      <HotkeysEditor saveCard={saveCard} />
      {
        editingMode.isEditing ? (
        <div>
          <EditorEntries
          // markdownEntriesData={markdownEntriesData}
          onMarkdownEntryChange={onMarkdownEntryChange}
          entries={editorEntries} entriesEditors={editorJsEntries}
          saveEditorInstance={saveEditorInstance} deleteEntryEditor={deleteEntryEditor}
          chooseType={chooseType} updateEditorChanged={updateEditorChanged}
          editorChanged={editorChanged}
          updateEntryFormat={updateEntryFormat}
          />
          <EditorActions addNewEntry={addNewEntryContext} saveCard={saveCard}
          editorChanged={editorChanged} card={card}
          />
        </div>
        ) :
        <div>
          <RepeatEntries
            treeItem={treeItem} entries={entries}
            advanceCardContext={advanceCardContext}
            saveEditorInstance={saveEditorInstance}
            updateEditorChanged={updateEditorChanged}
            treeItemId={treeItem.id} entriesEditors={editorJsEntries}
            isQuestioning={isQuestioning} updateIsQuestioning={updateIsQuestioning}
            editingMode={editingMode} toggleEditing={toggleEditing}
          />
          <div onClick={() => saveCard()} className="btn btn-ed editor__save">Save{editorChanged ? "*": ""}</div>
        </div>
      }

      <div onClick={()=> {
        toggleEditing();
        updateIsQuestioning(true);
        updateEditorJsEntries([]);
      }} className="btn-ed editor__preview-button">
      {
        !editingMode.isEditing ? 'Edit' :
        (editingMode.isStudying ? 'Study' : 'Preview')
      }
      </div>
    </div>
  )
  }
  }
</CollectionConsumer>
  );
}

export default Editor;
