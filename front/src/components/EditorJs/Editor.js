import React, {useEffect, useState} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import HotkeysEditor from './HotkeysEditor';
import EditorActions from './EditorActions';
import EditorEntries from './EditorEntries';
import EditorHeader from './EditorHeader';

import RepeatEntries from './Repeat/RepeatEntries';

const Editor = ({block, repeat=false}) => {
    const [isRepeatMode, updateIsRepeatMode] = useState(repeat);
    const [editorChanged, updateEditorChanged] = useState(false);
    const [entriesEditors, updateEntriesEditors] = useState(null);

    useEffect(() => {
        updateEntriesEditors(new Array())
    }, [block]);
    return (
<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryC,
        chooseTypeC, card, isCardUpdating, saveCardServer,
        findLastDeck
    }) => {
        
    if(!card || isCardUpdating) {
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    const deckParent = findLastDeck(block);
    
    const deck_title = deckParent.data.name;
    
    const saveCard = async () => { 
        updateEditorChanged(false);
        console.log("those editors!!", entriesEditors)
        entriesEditors.map( async ({entry, instance}) => {
            console.log("instance", instance);
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardServer(await Object.assign({}, card))
    }

    const saveEditorInstance = (instance, entry) => {
        if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            
        }
    }

    // it works for some reason
    const deleteEntryEditor = (id) => {
        deleteEntryC(id);
        updateEntriesEditors(entriesEditors.filter(eE => eE.entry.id != id));
        setTimeout(() => {
            console.log("entries editors", entriesEditors);
        }, 300);
        
    }

    const chooseType = (entryId, type) => {
        chooseTypeC(block.id, entryId, type);
    }

    return (
        <div className="editor">
            <HotkeysEditor saveCard={saveCard} />
            {
                !isRepeatMode ? (
                <div> 
                    <EditorHeader template_title={template_title} deck_title={deck_title} />
                    <EditorEntries entries={entries} entriesEditors={entriesEditors} blockId={block.id} 
                    saveEditorInstance={saveEditorInstance} deleteEntryEditor={deleteEntryEditor} 
                    chooseType={chooseType} updateEditorChanged={updateEditorChanged} editorChanged={editorChanged}
                    />
                    <EditorActions addNewEntry={addNewEntryContext} saveCard={saveCard} 
                    editorChanged={editorChanged} card={card}
                    
                    />
                    <div onClick={()=> updateIsRepeatMode(true)} className="btn-contrast"> Preview </div>
                </div>
                ) : 
                <div> 
                    <RepeatEntries 
                        entries={entries} 
                        saveEditorInstance={saveEditorInstance}
                        updateEditorChanged={updateEditorChanged}
                        blockId={block.id} entriesEditors={entriesEditors}
                    />
                    
                </div>
            }
            
        </div>
    )
    }
    }
</CollectionConsumer>
    );
}

export default Editor;
