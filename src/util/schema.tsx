export function canRenderAsForm(schema) {
    if (!schema?.properties) return false;

    const check = (props, level = 0) => {
        if (level > 1) return false;

        for (const prop of Object.values(props)) {
            if (prop.type === 'array') return false;
            if (prop.oneOf || prop.anyOf || prop.allOf) return false;

            if (prop.type === 'object') {
                if (!prop.properties) return false;
                if (!check(prop.properties, level + 1)) return false;
            }
        }
        return true;
    };

    return check(schema.properties);
}

export function generateEmptyObject(schema) {
    const obj = {};
    Object.entries(schema.properties || {}).forEach(([key, prop]) => {
        if (prop.type === 'object') {
            obj[key] = generateEmptyObject(prop);
        } else {
            obj[key] = '';
        }
    });
    return obj;
}

export function resolveActionWrappers(operation, swaggerSpec) {
    const requestSchema =
        operation?.requestBody?.content?.['application/json']?.schema;

    if (!requestSchema?.properties) {
        return [];
    }

    return Object.entries(requestSchema.properties)
        .map(([wrapperName, wrapperSchema]) => {
            const ref =
                wrapperSchema?.allOf?.[0]?.$ref ||
                wrapperSchema?.items?.allOf?.[0]?.$ref;

            if (!ref) return null;

            const refKey = ref.split('/').pop();
            const innerSchema = swaggerSpec.components?.schemas?.[refKey];

            if (!innerSchema) return null;

            return {
                wrapperName,
                wrapperSchema,
                innerSchema
            };
        })
        .filter(Boolean);
}

export function generateEmptyArray(schema) {
    return [generateEmptyObject(schema)];
}