import { getFieldsWithDirectives } from 'graphql-toolkit';

const authenticated = next => (root, args, context, info) => {
    console.log('AUTH');
    if (!context.currentUser) {
        throw new Error(`Unauthenticated!`);
    }

    return next(root, args, context, info);
};

const DIRECTIVE_TO_GUARD = {
    auth: () => authenticated,
};

export const resolversComposition = (...data) => {
    const { typeDefs } = data[0];
    const fieldsAndTypeToDirectivesMap = getFieldsWithDirectives(typeDefs);

    return Object.keys(fieldsAndTypeToDirectivesMap).reduce(
        (result, fieldPath) => {
            const directives = fieldsAndTypeToDirectivesMap[fieldPath];
            if (directives.length === 0) return result;
            const res = directives
                .map(({ name, args }) => {
                    if (!(name in DIRECTIVE_TO_GUARD)) return null;

                    return DIRECTIVE_TO_GUARD[name](args);
                })
                .filter(Boolean);

            return { ...result, [fieldPath]: res };
        },
        {}
    );
};
