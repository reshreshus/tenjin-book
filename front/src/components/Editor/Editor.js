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

    const onMarkdownEntryChange = (idx, value) => {
        editorEntries.filter(e => e.id === idx)[0].content = value;
        // updateMarkdownEntriesData([...markdownEntriesData])
    }

    const updateEntryFormat = (idx, format) => {
        console.log({format})
        let entry = editorEntries.filter(e => e.id === idx)[0];
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
        chooseTypeContext, card, saveCardContext,
        findLastDeck, editingMode,
        updateEditingMode, advanceCardContext
    }) => {
    if (treeItem.data.type === 'D')  {
        return <Redirect push to='/show-deck' />
    }
    if(!card) {
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    editorEntries.length = 0;
    editorEntries.push(...entries)
    editorEntries.forEach(e => {
        e.key = `${e.id}${treeItem.id}`
    });

    const deckParent = findLastDeck(treeItem);

    const saveCard = async () => {
        updateEditorChanged(false);
        editorJsEntries.map( async ({entry, instance}) => {
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardContext(await Object.assign({}, card))
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
                    <EditorHeader template_title={template_title} deckParent={deckParent} />
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
                    <div onClick={() => saveCard()} className="btn btn-text editor__save">Save{editorChanged ? "*": ""}</div>
                </div>
            }

            <div onClick={()=> {
                toggleEditing();
                updateIsQuestioning(true);
                updateEditorJsEntries([]);
            }} className="btn-contrast editor__preview-button">
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
