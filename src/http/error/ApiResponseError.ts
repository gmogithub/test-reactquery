export class ApiResponseError extends Error {
    public response: any;

    constructor(response: any, ...params: Array<any>) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiResponseError);
        }
        this.response = response;
    }
}