export type List = {
    payload: string
    shownValue: string
}

export type KindListValue = {
    title: string
    payload: string
}

export interface KindList extends List {
    values: KindListValue[]
}
