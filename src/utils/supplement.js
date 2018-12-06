/**
 * 补充
 **/
export function Supp() {
    return {
        JSON: {
            toString(json, separator) {
                return Object.keys(json)
                    .map(key => json[key])
                    .join(separator);
            }
        }
    }
}