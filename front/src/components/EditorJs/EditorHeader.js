import React from 'react'

export default function EditorHeader({deck_title, template_title}) {
    return (
        <div className="editor__header">
            <div className="editor__header-left">
                <div className="editor__subtitle text-blue-bright"> Deck </div>
                <div className="editor__title text-dark">
                    {deck_title}
                </div>
            </div>
            <div className="editor__header-right">
                <div className="editor__subtitle text-blue-bright"> Template </div>
                <div className="editor__title text-dark">
                    {template_title}
                </div>
            </div>
        </div>
    )
}
