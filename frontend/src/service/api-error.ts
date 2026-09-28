export class ApiError extends Error {
    status: number;
    errorTitle: string;

    constructor(message: string, status: number, errorTitle: string) {
        super(message);
        this.status = status;
        this.errorTitle = errorTitle;
    }
}