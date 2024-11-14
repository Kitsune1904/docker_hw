export class ApiError extends Error {
    statusCode: number;
    obj?: object;

    constructor(statusCode: number, message: string, obj?: any) {
        super(message);
        this.statusCode = statusCode;
        this.obj = obj;
    }
}