import React from 'react'

const updateCardEntries = (cardId, changes) => {
    console.log("card is updating (supposedly)", changes)
}




const Collection = React.createContext();

class CollectionProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            decks: [
                {
                    "id": "1",
                    "name": "English"
                },
                {
                    "id": "2",
                    "name": "Math"
                },
                {
                    "id": "3",
                    "name": "Programming"
                },
            ],
            card: {
                id: "database generated",
                deck_id: "from db",
                template_id: "from db",
                deck_title: "Enlish",
                template_title: "Basic",
                entries: [
                    {
                        entry_id: 0,
                        entry_name: "Front",
                        content: {
                            blocks: [{
                                type: "paragraph",
                                data: { text: "probably some editorJs stuff or html" }
                            }]
                        },
                        entry_type: "Q",
                    },
                    {
                        entry_id: 1,
                        entry_name: "Back",
                        content: {
                            blocks: [{
                                type: "paragraph",
                                data: { text: "probably some editorJs stuff or html" }
                            }]
                        },
                        entry_type: "A",
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
            content: {
                blocks: [{
                    type: "paragraph",
                    data: { text: "new entry" }
                }]
            },
            entry_type: "A",
            entry_name: "Back",
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

    chooseTypeC = (cardId, entryId, type) => {
        console.log("chooseType Context")
    }

    render () {
        return (
            <Collection.Provider value={{
                    card: this.state.card,
                    decks: this.state.decks,
                    updateCardEntries,
                    addNewEntryContext: this.addNewEntryContext,
                    deleteEntryContext: this.deleteEntryContext,
                    chooseTypeC: this.chooseTypeC,
            }}>
                {this.props.children}
            </Collection.Provider>
        )
    }
    
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

