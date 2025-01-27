import { NextApiRequest, NextApiResponse } from 'next';
import knex from 'knex';
import knexConfig from '../../../knexfile';
import { StatusCode } from "@/lib/statusCodes";
import { transformResponse } from "@/lib/interceptors/transformInterceptor";
import {jwtVerify} from "jose";

const db = knex(knexConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(StatusCode.UNAUTHORIZED).json(transformResponse({
                    data: null,
                    message: 'Unauthorized - No token provided',
                    statusCode: StatusCode.UNAUTHORIZED
                }));
            }

            const verified = await jwtVerify(
                token as string,
                new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
            );

            if (!token && verified.payload.roleId===1) {
                return res.status(StatusCode.UNAUTHORIZED).json(transformResponse({
                    data: null,
                    message: 'Unauthorized - No token provided',
                    statusCode: StatusCode.UNAUTHORIZED
                }));
            }
            const { id, status } = req.body;

            if (!id || typeof status !== 'number' || ![-1,0, 1, -2].includes(status)) {
                return res.status(StatusCode.BAD_REQUEST).json(transformResponse({
                    data: null,
                    message: 'ID và trạng thái không hợp lệ.',
                    statusCode: StatusCode.BAD_REQUEST,
                }));
            }

            const [updatedDisplay] = await db('displays')
                .where({ id })
                .update({ 
                    status,
                    updated_at: db.fn.now()
                })
                .returning('*');

            if (!updatedDisplay) {
                return res.status(StatusCode.NOT_FOUND).json(transformResponse({
                    data: null,
                    message: 'Không tìm thấy màn hình.',
                    statusCode: StatusCode.NOT_FOUND,
                }));
            }

            return res.status(StatusCode.OK).json(transformResponse({
                data: updatedDisplay,
                message: 'Cập nhật trạng thái màn hình thành công.',
                statusCode: StatusCode.OK,
            }));

        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái màn hình:', error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'Đã xảy ra lỗi khi cập nhật trạng thái màn hình.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    }

    res.setHeader('Allow', ['PUT']);
    return res.status(StatusCode.METHOD_NOT_ALLOWED).json(transformResponse({
        data: null,
        message: `Phương thức ${req.method} không được hỗ trợ.`,
        statusCode: StatusCode.METHOD_NOT_ALLOWED,
    }));
}
