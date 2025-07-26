export interface ResponseModel<T = any> {
    success: boolean;
    message: string;
    data?: T;
}