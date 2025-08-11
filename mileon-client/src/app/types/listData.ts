export interface ListData<T> {
    id: T,
    value: string
}

export interface ReturnedData<T> {
    list: [
        {id:T, value: string}
    ],
    count: number,
    total: number
}
