/**
 * ItemCard.jsx
 *
 * One card in the list screen represents one item. 
 * basically replaces ItemCardPrototype from hw1, the 
 * component is the template now so no cloning
 */
import { DateUtil } from '../common/DateUtil.js';
import { PriorityUtil } from '../common/PriorityUtil.js';
import IconButton, { DELETE_GLYPH, DUPLICATE_GLYPH } from './IconButton.jsx';
// use actual class names rather than text since tailwind runs before app starts 
const PILL_COLOR = {
    [PriorityUtil.HIGH]: 'bg-priority-high',
    [PriorityUtil.MEDIUM]: 'bg-priority-medium',
    [PriorityUtil.LOW]: 'bg-priority-low'
};


// this is a comoponent which is a func that returns what to draw
// contains props (parameters) item,index, etc similar to initializeClone(element, item, index) 
// onEdit,onDuplicate,etc are funcs ListView passes so the card just call them
export default function ItemCard({ item, index, dropEdge, onDelete, onEdit, onDuplicate, onDragStart, onDragEnd }) {
    const label = `Edit the item ${item.description}${item.completed ? ', completed' : ''}`;

    // same as listcard, enter/space opens item
        function handleKeyDown(event) {
        // key pressed on one of the buttons belongs to that button, not the card
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onEdit();
    }

    // red line on whichever edge a dragged card will land
    let dropClass = '';
    if (dropEdge === 'before') dropClass = 'drop-before';
    if (dropEdge === 'after') dropClass = 'drop-after';

    // everythign inside return () is JSX, looks like html, react turns into elements
    // { } calls js and puts result there

    return (
        <li
            className={`item-card item-grid mt-2.5 cursor-pointer items-center gap-3 rounded-card
                        border-l-[0.3125rem] border-l-grey-300 bg-sbu-white px-[0.875rem] py-2.5
                        shadow-card first:mt-0 ${item.completed ? 'item-completed' : ''} ${dropClass}`}
            data-index={index}
            role="button"
            tabIndex={0}
            aria-label={label}
            draggable

            // arrow function wraps call so index gets passed, listview needs to know which card started drag
            onDragStart={(event) => onDragStart(index, event)}
            onDragEnd={onDragEnd}
            onClick={onEdit}
            onKeyDown={handleKeyDown}>

            {/* empty, lines up with empty handle column in headers */}
            <span className="area-handle" />

            <span className={`item-description area-description min-w-0 truncate font-semibold
                              ${item.completed ? 'line-through' : ''}`}>
                {item.description}
            </span>

            {/* 2026-09-19 turns to 09/19/2026 */}
            <span className="area-entered text-center text-[0.875rem] tabular-nums text-grey-700">
                {DateUtil.format(item.dateEntered)}
            </span>

            <span className="area-priority text-center">
                <span className={`rounded-full px-2 py-0.5 text-[0.75rem] font-semibold text-sbu-white
                                  ${PILL_COLOR[item.priority]}`}>
                    {item.priority}
                </span>
            </span>

            {/* when theres no date, no check needed */}
            <span className="area-target text-center text-[0.875rem] tabular-nums text-grey-700">
                {DateUtil.format(item.targetDate)}
            </span>

            <span className="area-completed text-center font-bold text-completed-mark">
                {item.completed ? '✓' : ''}
            </span>

            <span className="area-actions flex justify-end gap-1">
                <IconButton
                    action="duplicate-item"
                    label={`Duplicate the item ${item.description}`}
                    glyph={DUPLICATE_GLYPH}
                    onClick={onDuplicate} />
                    
                <IconButton
                    action="delete-item"
                    label={`Delete the item ${item.description}`}
                    glyph={DELETE_GLYPH}
                    danger
                    onClick={onDelete} />
            </span>

            
        </li>
    );
}