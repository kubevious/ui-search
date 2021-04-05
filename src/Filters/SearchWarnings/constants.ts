import { FilterEntry } from "../types"

export const FILTER_ENTRIES_WARNINGS: FilterEntry[] = [
    {
        caption: "With warnings",
        value: {
            kind: "at-least",
            count: 1,
        },
    },
    {
        caption: "Without warnings",
        value: {
            kind: "at-most",
            count: 0,
        },
    },
]