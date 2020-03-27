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
    const [entriesEditors, updateEntriesEditors] = useState(null);
    const [markdownEntriesData, updateMarkdownEntriesData] = useState([]);

    const [isQuestioning, updateIsQuestioning] = useState(true);

    useEffect(() => {
        updateEntriesEditors(new Array())
    }, [treeItem]);

    const onMarkdownEntryChange = (idx, value) => {
        markdownEntriesData.filter(e => e.id === idx)[0].content = value;
        // updateMarkdownEntriesData([...markdownEntriesData])
    }
    
    return (
<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryContext,
        chooseTypeContext, card, isCardUpdating, saveCardContext,
        findLastDeck, editingMode,
        updateEditingMode, advanceCardContext
    }) => {
    if (treeItem.data.type === 'D')  {
        return <Redirect push to='/show-deck' />
    }
    if(!card) {
        // TODO
        if (isCardUpdating)
            return <div>loading</div>
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    
    entries.map(e => {
        e.key = `${e.id}${treeItem.id}`
        if (e.format === "markdown") {
            markdownEntriesData.push(e);
        }
    });

    const deckParent = findLastDeck(treeItem);
    
    const deck_title = deckParent.data.name;
    
    const saveCard = async () => { 
        updateEditorChanged(false);
        entriesEditors.map( async ({entry, instance}) => {
            // console.log("instance", instance);
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
            // console.log("new content", blocks);
        })
        // this line probably doesn't make sense
        saveCardContext(await Object.assign({}, card))
    }

    const saveEditorInstance = (instance, entry) => {
        // if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            // 
        // }
    }

    // it works for some reason
    const deleteEntryEditor = (id) => {
        deleteEntryContext(id);
        updateEntriesEditors(entriesEditors.filter(eE => eE.entry.id != id));
        setTimeout(() => {
            console.log("entries editors", entriesEditors);
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
            <EditorHeader template_title={template_title} deck_title={deck_title} />
            {
                editingMode.isEditing ? (
                <div> 
                    
                    <EditorEntries 
                    // markdownEntriesData={markdownEntriesData}
                    onMarkdownEntryChange={onMarkdownEntryChange}
                    entries={entries} entriesEditors={entriesEditors}
                    saveEditorInstance={saveEditorInstance} deleteEntryEditor={deleteEntryEditor} 
                    chooseType={chooseType} updateEditorChanged={updateEditorChanged} editorChanged={editorChanged}
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
                        treeItemId={treeItem.id} entriesEditors={entriesEditors}
                        isQuestioning={isQuestioning} updateIsQuestioning={updateIsQuestioning}
                        editingMode={editingMode} toggleEditing={toggleEditing}
                    />
                    <div onClick={() => saveCard()} className="btn btn-text editor__save">Save{editorChanged ? "*": ""}</div>
                </div>
            }
            

            <div onClick={()=> {
                toggleEditing();
                updateIsQuestioning(true);
                updateEntriesEditors(new Array());
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
