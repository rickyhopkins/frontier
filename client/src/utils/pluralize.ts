export const pluralize = (count: number, singular: string, plural?: string) => {
    const calculatedPlural = plural || singular + "s";
    return `${count} ${count === 1 ? singular : calculatedPlural}`;
};
