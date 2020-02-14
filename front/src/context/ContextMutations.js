
export const getContextMutations = (
    addDeckContext, 
    addItemContext, 
    selectBlockToRenameContext,
    duplicateBlockContext,
    deleteBlockContext,
    toggleExpanded,
    contextBlock
    ) => {

    return [
        {
            "desc": "New Deck",
            "shortcut": "Alt + Shift + D",
            "hotkeyJs": "alt+shift+d",
            "func": () => {
                console.log("New Deck");
                addDeckContext(contextBlock.id);
            }
        },
        {
            "desc": "New Topic",
            "shortcut": "N",
            "hotkeyJs": "n",
            "func": () => {
                console.log("New Topic");
                addItemContext(contextBlock, 'T');
            },
        },
        {
            "desc": "New Card",
            "shortcut": "A",
            "hotkeyJs": "a",
            "func": () => {
                console.log("New New Card")
                addItemContext(contextBlock, 'f');
            },
        },
        {
            // when you press rename, cursor goes away
            // go it doesn't edit, but 'a' will trigger flashcard creation
            "desc": "Rename",
            "shortcut": "F2",
            "hotkeyJs": "f2",
            "func": () => {
                console.log("Rename")
                selectBlockToRenameContext();
            },
            "disabled": true
        },
        {
            "desc": "Duplicate",
            "shortcut": "Ctrl + Shift + D",
            "hotkeyJs": "ctrl+shift+d",
            "func": () => {
                console.log("Duplicate");
                duplicateBlockContext(contextBlock.id)
            },
        },
        {
            "desc": "Delete",
            "shortcut": "delete",
            "hotkeyJs": "del",
            "func": () => {
                console.log("Delete")
                deleteBlockContext(contextBlock.id);
            },
        },
        {
            "desc": "Toggle Collapsedness",
            "shortcut": "Z",
            "hotkeyJs": "z",
            "func": () => {
                console.log("Toggle Collapsedness");
                toggleExpanded(contextBlock);
            },
        },
        {
            "desc": "Collapse All",
            "shortcut": "Ctrl+Z",
            "hotkeyJs": "ctrl+z",
            "func": () => {
                console.log("Toggle Collapsedness")
            },
        }
    ]
}