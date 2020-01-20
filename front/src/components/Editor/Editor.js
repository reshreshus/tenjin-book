import React from 'react'

export default function Editor({card}) {
    const {deckTitle, templateTitle} = card;
    return (
        // <div className="editor-container" >
            <div className="editor">
                <div className="editor__header">
                    <div className="editor__header-left">
                        <div className="editor__subtitle text-blue-bright"> Deck </div>
                        <div className="editor__title text-dark">
                            {deckTitle}
                        </div>
                    </div>
                    <div className="editor__header-right">
                        <div className="editor__subtitle text-blue-bright"> Template </div>
                        <div className="editor__title text-dark">
                            {templateTitle}
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    )
}
