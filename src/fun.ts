import {flow, removeAt, prepend, head, tail, not, mergeInto} from 'accessor-ts/dist'

// exported for backwards compatibility
export {removeAt, prepend, head, tail, not, mergeInto}

/**
 * @deprecated use "flow" from accessor-ts
 */
export const pipe = flow
