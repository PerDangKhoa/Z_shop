import { StatusCode } from "@/lib/statusCodes";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

interface TransformResponseOptions<T> {
    data: T;
    message?: string;
    statusCode?: number;
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export function transformResponse<T>({
    data,
    message = 'Request was successful',
    statusCode = StatusCode.OK,
    pagination,
}: TransformResponseOptions<T>): ApiResponse<T> {
    return {
        status: statusCode,
        message,
        data,
        ...(pagination && { pagination }),
    };
}
