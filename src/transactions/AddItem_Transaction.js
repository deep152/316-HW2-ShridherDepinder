/**
 * AddItem_Transaction.js
 *
 * Puts a new item into the open list, takes it back out on undo
 *
 * the item is made before this is, so every redo puts back the same object (same id)
 * same shape but backwards of DeleteItem_Transaction
 */
import { jsTPS_Transaction } from '../lib/jsTPS.js';

export class AddItem_Transaction extends jsTPS_Transaction {
    #operations;
    #item;
    #index;

    /**
     * @param {Object} operations the list operations handed out by CurrentListContext
     * @param {Object} item the new item, already made
     * @param {number} index where it goes
     */
    constructor(operations, item, index) {
        super();
        this.#operations = operations;
        this.#item = item;
        this.#index = index;
    }

    doTransaction() {
        this.#operations.addItem(this.#item, this.#index);
    }

    undoTransaction() {
        this.#operations.removeItemAt(this.#index);
    }

    toString() {
        return `AddItem_Transaction(index ${this.#index})`;
    }
}