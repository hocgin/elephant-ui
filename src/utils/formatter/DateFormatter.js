import moment from "moment";

/**
 * 时间戳 => YYYY-MM-DD HH:mm:ss
 *
 * @param timestamp
 * @returns {string}
 */
export function toUTC(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}