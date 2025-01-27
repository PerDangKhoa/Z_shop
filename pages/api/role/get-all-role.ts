import { NextApiRequest, NextApiResponse } from 'next';
import knex from 'knex';
import knexConfig from '../../../knexfile';
import { StatusCode } from "@/lib/statusCodes";
import { transformResponse } from "@/lib/interceptors/transformInterceptor";

const db = knex(knexConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const roles = await db('roles')
                .select('*')
                .orderBy('id', 'desc');

            res.status(StatusCode.OK).json(transformResponse({
                data: roles,
                message: 'Roles retrieved successfully.',
                statusCode: StatusCode.OK,
            }));
        } catch (error) {
            console.error(error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(transformResponse({
                data: null,
                message: 'An error occurred while retrieving roles.',
                statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            }));
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(StatusCode.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);
    }
}
