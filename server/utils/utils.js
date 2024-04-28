function getType(value) {
    if (Array.isArray(value)) return Array;
    if (value === null) return null;
    return value.constructor;
}

module.exports = {
    getType
};