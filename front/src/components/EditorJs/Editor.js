import React, {useEffect, useState} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import HotkeysEditor from './HotkeysEditor';
import EditorActions from './EditorActions';
import EditorEntries from './EditorEntries';
import EditorHeader from './EditorHeader';

const Editor = ({block}) => {
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

    const addNewEntry = (cardId) => {
        addNewEntryContext(cardId)
    }

    const saveEditorInstance = (instance, entry) => {
        if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            
        }
        console.log("S!!! entries_editors", entriesEditors);
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
            <EditorHeader template_title={template_title} deck_title={deck_title} />
            <EditorEntries entries={entries} entriesEditors={entriesEditors} block={block} 
            saveEditorInstance={saveEditorInstance} deleteEntryEditor={deleteEntryEditor} 
            chooseType={chooseType} updateEditorChanged={updateEditorChanged} editorChanged={editorChanged}
            />
            <EditorActions addNewEntry={addNewEntryContext} saveCard={saveCard} editorChanged={editorChanged} card={card}/>
        </div>
    )
    }
    }
</CollectionConsumer>
    );
}

export default Editor;
