/**
 * RenameList_Transaction.js
 *
 * renames the open list, puts the old name back on undo, both names are handed 
 * in up front, so this never has to read the list
 */
import { jsTPS_Transaction } from '../lib/jsTPS.js';

export class RenameList_Transaction extends jsTPS_Transaction {
    #operations;
    #oldName;
    #newName;

    /**
     * @param {Object} operations the list operations handed out by CurrentListContext
     * @param {string} oldName what it was called
     * @param {string} newName what its called now
     */
    constructor(operations, oldName, newName) {
        super();
        this.#operations = operations;
        this.#oldName = oldName;
        this.#newName = newName;
    }

    doTransaction() {
        this.#operations.setName(this.#newName);
    }

    undoTransaction() {
        this.#operations.setName(this.#oldName);
    }

    toString() {
        return `RenameList_Transaction(${this.#oldName} to ${this.#newName})`;
    }
}