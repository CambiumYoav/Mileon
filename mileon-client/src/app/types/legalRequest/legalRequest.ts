export class LegalRequest {
    legalRequestID: string;
    legalRequestNumber: string;
    ticketNumber: string;
    vehicleNumber: string;
    NID: string;
    firstName: string;
    lastName: string;
    creationDate: Date;
    status: string;
    statusID: number;
    requestSourceID: number;
    requestSource: string;
    requestTypeID: number;
    requestTypeName: string;

    constructor(args?: any) {
        if (args && typeof args === 'object') {
            //   Object.assign(this, args);
            for (let key of Object.keys(args)) {
                // format date:
                if (
                    isNaN(args[key]) &&
                    new Date(args[key]).toString() !== 'Invalid Date' &&
                    key !== 'ticketNumber'
                ) {
                    args[key] = new Date(args[key]).toLocaleDateString('he-IL');
                }
            }
            const flattened = this.flatten(args);
            Object.assign(this, flattened);
        }
    }

    flatten(obj: LegalRequest) {
        const result = {};
        for (const key of Object.keys(obj)) {
            if (obj[key] && typeof obj[key] === 'object') {
                const nested = this.flatten(obj[key]);
                for (const nestedKey of Object.keys(nested)) {
                    result[`${key}.${nestedKey}`] = nested[nestedKey];
                }
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }
}