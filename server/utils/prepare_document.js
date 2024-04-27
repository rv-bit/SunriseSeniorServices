const { getType } = require('./utils');

const prepareDocument = (Schema, Document) => {
    Object.entries(Schema).forEach(([key, value]) => {
        if (value.required && !Document[key]) {
            throw new Error(`Missing required key: ${key}`);
        }
    })

    Object.keys(Document).forEach((key) => {
        if (!Schema[key]) {
            throw new Error(`Invalid key: ${key}`);
        }

        if (getType(Document[key]) !== Schema[key].type) {
            throw new Error(`Invalid type for key: ${key}`);
        }

        if (Schema[key].type === 'Array' && !Array.isArray(Document[key])) {
            throw new Error(`Invalid type for key: ${key}`);
        }

        Schema[key].default_value = Document[key];
    });

    const data = Object.entries(Schema).reduce((acc, [key, value]) => {
        acc[key] = value.default_value;
        return acc;
    }, {});

    return data
}

module.exports = prepareDocument