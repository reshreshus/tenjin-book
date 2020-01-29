export const hideContextMenu = () => {
    let menu = document.querySelector('.cmenu')
    menu.classList.add('hide');
    menu.style.top = '-200%';
    menu.style.left = '-200%';
}

export const removeSelections = () => {
    let sel = window.getSelection();
    sel.removeAllRanges();
}

export const enabeEditable = (el) => {
    el.setAttribute('disabled', false);
    el.setAttribute('contenteditable', true);
}

export const disableEditable = (el) => {
    el.setAttribute('disabled', true);
    el.setAttribute('contenteditable', false);
}

export const selectElementContents = (el) => {
    let range;
    if (window.getSelection && document.createRange) {
        range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        
    } else if (document.body && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}