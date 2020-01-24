import React, {useEffect, useState} from 'react'
import ContentEditable from 'react-contenteditable'
import {Link} from 'react-router-dom';

export default function Deck({deck, selectedDeckId, updateSelectedDeckId}) {
    // TODO: rename on F2
    let contentEditable;
    const [name, updateName] = useState(deck.name)

    useEffect(() => {
        contentEditable = React.createRef();
    })

    const handleChange = e => {
        updateName(e.target.value);
    };

    const onKeyDown = e => {
        // Finish editing when ENTER is pressed
        // TODO: get back to the previous value if ESC is pressed
        if (e.keyCode == 13) {
            e.preventDefault();
            updateSelectedDeckId('');
        }
    }

    const onDeckClick = (e) => {
        // e.preventDefault();
        updateSelectedDeckId(deck.id)

    }

    return (
        <div className={`deck ${deck.id !== selectedDeckId ? '': 'deck--active'}` } 
        onClick={(e)  => onDeckClick(e)}
            > 
            <Link className={`deck__link`}
                to={`/show-deck/${deck.id}`} >
                <ContentEditable 
                    innerRef={contentEditable}
                    html={name}
                    disabled={ deck.id !== selectedDeckId }
                    onChange={handleChange}
                    tagName='div'  // div by default but still
                    onKeyDown={onKeyDown}
                />
            </Link>
        </div>
    )
}
