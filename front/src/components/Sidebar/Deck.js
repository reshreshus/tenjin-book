import React, {useEffect, useState} from 'react'
import ContentEditable from 'react-contenteditable'

export default function Deck({deck, selectedDeckId, updateSelectedDeckId}) {
    // TODO: rename on F2
    let contentEditable;
    const [name, updateName] = useState(deck.name)

    useEffect(() => {
        contentEditable = React.createRef();
    })

    const handleChange = e => {
        console.log(e.target.value);
        updateName(e.target.value);
    };

    const onKeyDown = e => {
        console.log("onKeyDown")
        if (e.keyCode == 13) {
            e.preventDefault();
            updateSelectedDeckId('');
            
        }
        
    }

    return (
        <div className={`deck ${deck.id !== selectedDeckId ? '': 'deck--active'}`} onClick={() => { 
            console.log("CLICK, deck.id", deck.id)
            console.log("selectedDeckId", selectedDeckId)
            console.log((deck.id == selectedDeckId))
            updateSelectedDeckId(deck.id)}
        }
            > 
            
            <ContentEditable 
                innerRef={contentEditable}
                html={name}
                disabled={ deck.id !== selectedDeckId }
                onChange={handleChange}
                tagName='div'  // div by default but still
                onKeyDown={onKeyDown}
            />
        </div>
    )
}
