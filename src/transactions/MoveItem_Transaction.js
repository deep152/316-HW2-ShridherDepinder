/**
 * MoveItem_Transaction.js
 *
 * this moves one item to a new spot and you can move it back on undo.
 * undo is just same move with the two indexes swapped
 */
import { jsTPS_Transaction } from '../lib/jsTPS.js';

export class MoveItem_Transaction extends jsTPS_Transaction {
    #operations;
    #fromIndex;
    #toIndex;

    /**
     * @param {Object} operations the list operations handed out by CurrentListContext
     * @param {number} fromIndex where the item was
     * @param {number} toIndex where it goes
     */
    constructor(operations, fromIndex, toIndex) {
        super();
        this.#operations = operations;
        this.#fromIndex = fromIndex;
        this.#toIndex = toIndex;
    }

    doTransaction() {
        this.#operations.moveItem(this.#fromIndex, this.#toIndex);
    }

    undoTransaction() {
        this.#operations.moveItem(this.#toIndex, this.#fromIndex);
    }

    toString() {
        return `MoveItem_Transaction(${this.#fromIndex} to ${this.#toIndex})`;
    }
}