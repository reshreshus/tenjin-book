import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import ancestorFolder from '../assets/svg/ancestor-folder.svg';

export default function AppStats() {

    return (
        <CollectionConsumer>
        {
            ({headerDeck, contextTreeItem, findLastDeck}) => {
                let deckParent;
                if (contextTreeItem)
                    deckParent = findLastDeck(contextTreeItem);
                return (
                    <div className="item-stats">
                        <div className="item-stats__el">
                            <img className="item-stats__el-img" src={ancestorFolder} />
                            <span className="item-stats__el-title">
                                { headerDeck ? headerDeck.data.name : "Not chosen" }
                            </span>
                        </div>
                        { deckParent ? deckParent.data.name : '' }
                    </div>
                )
            }
        }
        </CollectionConsumer>
    )
}
