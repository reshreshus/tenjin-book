
export const getContextMutations = (
    addDeckContext, 
    addItemContext, 
    selectTreeItemToRenameContext,
    duplicateTreeItemContext,
    deleteTreeItemContext,
    toggleExpanded
    ) => {

    return [
        {
            "desc": "New Deck",
            "shortcut": "Alt + Shift + D",
            "hotkeyJs": "alt+shift+d",
            "func": () => {
                console.log("New Deck");
                addDeckContext();
            }
        },
        {
            "desc": "New Topic",
            "shortcut": "N",
            "hotkeyJs": "n",
            "func": () => {
                console.log("New Topic");
                addItemContext('T');
            },
        },
        {
            "desc": "New Card",
            "shortcut": "Ctrl + Shift + A",
            "hotkeyJs": "ctrl+shift+a",
            "func": () => {
                console.log("New New Card")
                addItemContext('f');
            },
        },
        {
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
                duplicateTreeItemContext()
            },
        },
        {
            "desc": "Delete",
            "shortcut": "delete",
            "hotkeyJs": "del",
            "func": () => {
                console.log("Delete")
                deleteTreeItemContext();
            },
        },
        {
            "desc": "Toggle Collapsedness",
            "shortcut": "Z",
            "hotkeyJs": "z",
            "func": () => {
                console.log("Toggle Expanded");
                toggleExpanded();
            },
        },
        // {
        //     "desc": "Collapse All",
        //     "shortcut": "Ctrl+Z",
        //     "hotkeyJs": "ctrl+z",
        //     "func": () => {
        //         console.log("Toggle Collapsedness")
        //     },
        // }
    ]
}