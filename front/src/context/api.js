export const addNewEntryApi = (card, updateCard) => {
    // let card = cards.filter(c => c.id === cardId)[0];
    // TODO: might be slow?
    // let idx = cards.indexOf(card)
    card.entries = [...card.entries, {
        entry_id: card.entries.length,
        content: {
            blocks: [{
                type: "paragraph",
                data: { text: "new entry" }
            }]
        },
        entry_type: "A",
        entry_name: "Back",
    }]
    updateCard(card);
}