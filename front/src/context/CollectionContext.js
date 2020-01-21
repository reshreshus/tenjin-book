import React from 'react'

// import card from '../desc';


const updateCardEntries = (cardId, changes) => {
    console.log("card is updating (supposedly)", changes)
    console.log("card", card);
}




const Collection = React.createContext();

class CollectionProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             card: {
                id: "database generated",
                deck_id: "from db",
                template_id: "from db",
                deck_title: "Enlish",
                template_title: "Basic",
                entries: [
                    {
                        entry_id: 0,
                        content: "probably some editorJs stuff or html",
                        isQuestion: true,
                    },
                    {
                        entry_id: 1,
                        content: "probably some editorJs stuff or html",
                        isQuestion: false
                    },
                    
                ]
            }
        };
    }

    addNewEntryContext = (cardId) => {
        console.log("addNewEntryContext")
        let newCard = this.state.card;
        newCard.entries = [...this.state.card.entries, {
            entry_id: this.state.card.entries.length,
            content: "probably some editorJs stuff or html",
            isQuestion: false
        }]
        this.setState({
            card: newCard
        }, () => {
            console.log("state", this.state);
        })
    }

    deleteEntryContext = (cardId, entryId) => {
        let newCard = this.state.card;
        newCard.entries = this.state.card.entries;
        newCard.entries.splice(entryId, 1)
        newCard.entries.map((e) => {
            if (e.entry_id > entryId) {
                e.entry_id--;
            }
        })
        this.setState({
            card: newCard
        }, () => {
            console.log("state", this.state);
        })
    }

    render () {
        return (
            <Collection.Provider value={{
                    card: this.state.card,
                    updateCardEntries,
                    addNewEntryContext: this.addNewEntryContext,
                    deleteEntryContext: this.deleteEntryContext
            }}>
                {this.props.children}
            </Collection.Provider>
        )
    }
    
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

