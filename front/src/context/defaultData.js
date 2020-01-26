export const blocks_import = [
    {
        "id": "1",
        "idx": "1",
        "name": "English",
        "expanded": true,
        "type": "D",
        "deck": "root",
        "path": [],
        "children": [
            {
                "id": "4",
                "idx": "1",
                "deck": "1",
                "path": [1],
                "name": "Witcher 3",
                "type": "D",
                "expanded": false,
                "children": [
                    {
                        "id": "5",
                        "deck": "1",
                        "path": [1,1],
                        "idx": "1",
                        "name": "The Last Wish",
                        "type": "D",
                    }
                ]
            }, 
            {
                "idx": "2",
                "type": "f",
                "id": "_1",
                "name": "a flashcard"
            }
        ]
    },
    {
        "id": "2",
        "idx": "2",
        "name": "Math",
        "type": "D",
        "path": [],
    },
    {
        "id": "3",
        "idx": "3",
        "name": "Programming",
        "type": "D",
        "path": [],
    },
]

export const cards_import = [{
    id: "_1",
    deck_id: "from db",
    // block_id: "from db",
    template_id: "from db",
    deck_title: "English",
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
}]