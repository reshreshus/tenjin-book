
export const getContextMutations = (
    addDeckContext, 
    addItemContext, 
    selectTreeItemToRenameContext,
    duplicateTreeItemContext,
    deleteTreeItemContext,
    toggleExpanded,
    contextTreeItem
    ) => {

    return [
        {
            "desc": "New Deck",
            "shortcut": "Alt + Shift + D",
            "hotkeyJs": "alt+shift+d",
            "func": () => {
                console.log("New Deck");
                addDeckContext(contextTreeItem.id);
            }
        },
        {
            "desc": "New Topic",
            "shortcut": "N",
            "hotkeyJs": "n",
            "func": () => {
                console.log("New Topic");
                addItemContext(contextTreeItem, 'T');
            },
        },
        {
            "desc": "New Card",
            "shortcut": "A",
            "hotkeyJs": "a",
            "func": () => {
                console.log("New New Card")
                addItemContext(contextTreeItem, 'f');
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
                selectTreeItemToRenameContext();
            },
            "disabled": true
        },
        {
            "desc": "Duplicate",
            "shortcut": "Ctrl + Shift + D",
            "hotkeyJs": "ctrl+shift+d",
            "func": () => {
                console.log("Duplicate");
                duplicateTreeItemContext(contextTreeItem.id)
            },
        },
        {
            "desc": "Delete",
            "shortcut": "delete",
            "hotkeyJs": "del",
            "func": () => {
                console.log("Delete")
                deleteTreeItemContext(contextTreeItem.id);
            },
        },
        {
            "desc": "Toggle Collapsedness",
            "shortcut": "Z",
            "hotkeyJs": "z",
            "func": () => {
                console.log("Toggle Expanded");
                toggleExpanded(contextTreeItem.id);
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