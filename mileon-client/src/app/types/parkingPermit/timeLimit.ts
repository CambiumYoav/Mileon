export interface TimeLimit {
    timeLimitID: string
    day: number
    fromHour: Date
    toHour: Date
    permitTypeID: number
    permitTypeName: string
}

export class TimeLimitClass {
    timeLimitID: string = ''
    day: number | undefined = undefined
    fromHour: Date | undefined = undefined
    toHour: Date | undefined = undefined
    permitTypeID: number | undefined = undefined
    permitTypeName: string = ''
    enabled: boolean = false;
}