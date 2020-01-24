import React, {useEffect, useState} from 'react'
import ContentEditable from 'react-contenteditable'

export default function Deck({deck}) {
    let contentEditable;
    const [name, updateName] = useState(deck.name)

    useEffect(() => {
        contentEditable = React.createRef();
    })

    const handleChange = e => {
        console.log(e.target.value);
        updateName(e.target.value);
    };
    return (
        <div>
            <ContentEditable 
                innerRef={contentEditable}
                html={name}
                disabled={false}
                onChange={handleChange}
                tagName='div'  // div by default but still

            />
        </div>
    )
}
