/**
 * useListEditor.js
 *
 * Everything the list screen can do, as one hook. A component calls
 * duplicateItem(index) and never has to know about the contexts, the
 * transaction stack or the model behind it.
 */
import { useCurrentList } from '../context/CurrentListContext.jsx';
import { useLists } from '../context/ListsContext.jsx';
import { useModals } from '../context/ModalContext.jsx';
import { normalizeListName } from '../model/wolfieList.js';
import { DuplicateItem_Transaction } from '../transactions/DuplicateItem_Transaction.js';
import { EditItem_Transaction } from '../transactions/EditItem_Transaction.js';

import { DeleteItem_Transaction } from '../transactions/DeleteItem_Transaction.js';
import { cloneItem, createListItem, itemValues, valuesAreEqual } from '../model/listItem.js';
import { AddItem_Transaction } from '../transactions/AddItem_Transaction.js';
import { MoveItem_Transaction } from '../transactions/MoveItem_Transaction.js';
import { RenameList_Transaction } from '../transactions/RenameList_Transaction.js';

/** what the item modal is currently being used for */
export const ItemModalModes = {
    EDIT: 'edit',
    CREATE: 'create'

};

export function useListEditor() {
    const { list, operations, addTransaction, undo, redo, canUndo, canRedo } = useCurrentList();
    const { closeList } = useLists();
    const { openItemModal, closeItemModal, inform, askConfirm } = useModals();

    function requestEditItem(index) {
        openItemModal({
            mode: ItemModalModes.EDIT,
            index,
            itemCount: list.items.length,
            values: itemValues(list.items[index])
        });
    }

    /** opens the modal empty, nothing exists until the add is pressed */
    function requestAddItem() {
        openItemModal({
            mode: ItemModalModes.CREATE,
            index: -1,
            itemCount: list.items.length,
            values: {}
        });
    }

    /**
     * OK or Next in the item modal. Records the edit, or does nothing if
     * nothing changed.
     *
     * @param {Object} request { mode, index, values, then } 
     * where mode is 'edit' or 'create' and then is 'close' 'next' or 'previous'
     */
    function commitItemModal({ mode, index, values, then = 'close' }) {
        // the alert opens on top of the item modal, so what was typed is kept
        if (values.description === '') {
            inform({ title: 'A Description Is Required', message: 'Every item needs a description.' });
            return;
        }

        // new item gets made here and goes to end of list
        if (mode === ItemModalModes.CREATE) {
            addTransaction(new AddItem_Transaction(operations, createListItem(values), list.items.length));
            closeItemModal();
            return;
        }

        const oldValues = itemValues(list.items[index]);
        if (!valuesAreEqual(oldValues, values)) {
            addTransaction(new EditItem_Transaction(operations, index, oldValues, values));
        }

        // next and previous keep the modal open and move it, anything else closes
        if (then === 'next') {
            requestEditItem(index + 1);
        } else if (then === 'previous') {
            requestEditItem(index - 1);
        } else {
            closeItemModal();
        }
    }

    /** the copy is made here, once, so every redo puts back the same copy */
    function duplicateItem(index) {
        addTransaction(new DuplicateItem_Transaction(operations, index, cloneItem(list.items[index])));
    }

    /**
     * asks first, like deleting a list in HomeView, but this one can be undone
     *
     * @param {number} index which item
     */
    function requestDeleteItem(index) {
        const item = list.items[index];
        askConfirm({
            title: 'Delete This Item?',
            message: `"${item.description}" will be removed from this list. You can undo this.`,
            acceptLabel: 'Delete Item',
            // only runs on yes. the item is grabbed now, before its gone
            onAccept: () => addTransaction(new DeleteItem_Transaction(operations, index, item))
        });
    }

    function moveItem(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        // goes through the stack now so it can be undone
        addTransaction(new MoveItem_Transaction(operations, fromIndex, toIndex));
    }

    function renameList(requestedName) {
        const newName = normalizeListName(requestedName);
        if (newName === list.name) return;
        // list.name is still the old name here so get it before it changes
        addTransaction(new RenameList_Transaction(operations, list.name, newName));
    }

    return {
        list,
        items: list?.items ?? [],
        canUndo,
        canRedo,
        undo,
        redo,
        closeList,
        requestEditItem,
        requestAddItem,
        commitItemModal,
        duplicateItem,
        requestDeleteItem,
        moveItem,
        renameList
    };
}