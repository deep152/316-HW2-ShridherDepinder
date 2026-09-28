/**
 * DeleteItem_Transaction.js
 *
 * this removes one item and puts that item  on undo
 *
 * item is handed in when this is made, before anything is deleted,
 * since removeItemAt doesnt give the removed item back. keeping the same object
 * means it keeps its id through undo and redo
 * 
 * similar shape to DuplicateItem_Transaction
 */
import { jsTPS_Transaction } from '../lib/jsTPS.js';

export class DeleteItem_Transaction extends jsTPS_Transaction {
    #operations;
    #index;
    #item;

    /**
     * @param {Object} operations the list operations handed out by CurrentListContext
     * @param {number} index which item to delete
     * @param {Object} item the item itself, kept so undo can put it back
     */
    constructor(operations, index, item) {
        super();
        this.#operations = operations;
        this.#index = index;
        this.#item = item;
    }

    doTransaction() {
        this.#operations.removeItemAt(this.#index);
    }

    undoTransaction() {
        this.#operations.addItem(this.#item, this.#index);
    }

    toString() {
        return `DeleteItem_Transaction(index ${this.#index})`;
    }
}