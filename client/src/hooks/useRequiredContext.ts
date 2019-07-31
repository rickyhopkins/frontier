import * as React from 'react';
import { useContext } from 'react';

const isNotNullable = <T>(something: T): something is NonNullable<T> =>
    !!something;
export function useRequiredContext<T>(
    context: React.Context<T>
): NonNullable<T> {
    const c = useContext(context);
    if (isNotNullable(c)) {
        return c;
    }
    throw new Error('This component requires a context');
}
