import { FilterEntry } from "../types"


export const FILTER_ENTRIES_ERRORS: FilterEntry[] = [
    {
        caption: "With errors",
        value: {
            kind: "at-least",
            count: 1,
        },
    },
    {
        caption: "Without errors",
        value: {
            kind: "at-most",
            count: 0,
        },
    },
]
