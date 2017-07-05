export function dictValues(dictionary) {
    /**
     * Return an array of values that are present in this dictionary
     */
    let values = [];

    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            values.push(dictionary[key]);
        }
    }

    return values;
}

export function dictKeys(dictionary) {
    /**
     * Return an array of values that are present in this dictionary
     */
    let keys = [];

    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
}

export function dictItems(dictionary) {
    /**
     * Return an array of (key,value) pairs that are present in this
     * dictionary
     */
    let keyValues = [];

    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            keyValues.push([key, dictionary[key]]);
        }
    }

    return keyValues;
}
