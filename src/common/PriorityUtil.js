/**
 * PriorityUtil.js
 * A priority is one of exactly three values — High, Medium and Low, in that order
 * wherever the user is offered the choice — and anything else, or nothing at all,
 * means Low.
 *
 * This copies the DateUtil strategy
 */
export class PriorityUtil {
    static HIGH = 'High';
    static MEDIUM = 'Medium';
    static LOW = 'Low';  
    
    /**
     * @return {string[]} all of the three valid priorities, in display order
     */
    static values() {
        return [PriorityUtil.HIGH, PriorityUtil.MEDIUM, PriorityUtil.LOW];
    }

    /**
     * @param {*} value
     * @return {string} the value itself if its one of the three valid ones or low
     */
    static clean(value) {
        if(PriorityUtil.values().includes(value)){
            return value;
        }
        return PriorityUtil.LOW;
    }

    /**
     * @param {string} a priority which should alr be cleaned
     * @return {string} the CSS class that colors this priority 
     */
    static cssClass(value) {
        return `priority-${PriorityUtil.clean(value).toLowerCase()}`;
    }
}