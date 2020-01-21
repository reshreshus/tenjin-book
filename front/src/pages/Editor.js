import React from 'react'
import CardEntry from '../components/Editor/CardEntry';
import { CollectionConsumer } from '../context/CollectionContext';

  

export default function Editor() {
    return (<CollectionConsumer >
        { (value) => {
            // console.log("card", value.card);
            const {deck_title, template_title, entries} = value.card;
            return (
                <div className="editor">
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

                    <div className="editor__entries">
                        {   entries ?
                            entries.map((e, i) => (
                                <CardEntry key={i} data={e} />
                            )) : "Hmm, a card is empty. Strange..."
                        }
                    </div>
                    <div className="editor__actions">
                        <div className="btn btn-circ btn-plus-minus">+</div>
                        <div className="btn btn-primary">Save</div>
                    </div>
                </div>
            )
            }
        }
    </CollectionConsumer>)
}
