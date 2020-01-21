import React from 'react'

// import card from '../desc';
const card = {
    id: "database generated",
    deck_id: "from db",
    template_id: "from db",
    deck_title: "Enlish",
    template_title: "Basic",
    entries: [
        {
            entry_id: "1",
            content: "probably some editorJs stuff or html",
            isQuestion: true,
        },
        {
            entry_id: "2",
            content: "probably some editorJs stuff or html",
            isQuestion: false
        }
    ]
}


const Collection = React.createContext();

class CollectionProvider extends React.Component {
    render () {
        console.log("desc card", card);
        return (
            <Collection.Provider value={{
                    card: card,
            }}>
                {this.props.children}
            </Collection.Provider>
        )
    }
    
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

