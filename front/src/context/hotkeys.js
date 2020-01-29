import { enabeEditable, selectElementContents, hideContextMenu} from './helpers';

export const handleHotkeysExternal = (event, handler, selectedBlockId) => {
    switch (handler.key) {
        case 'f2':
            handleF2(event, handler, selectedBlockId);
            break;
        case 'esc':
            hideContextMenu();
            break;
        default:
            console.log("")
    }
}

const handleF2 = (event, handler, selectedBlockId) => {
    // Prevent the default refresh event under WINDOWS system
    console.log("handleF2");
    if (selectedBlockId !== '') {
        event.preventDefault();
        let el = document.querySelector(`.block-${selectedBlockId}`);
        enabeEditable(el)
        selectElementContents(el);
    }
}