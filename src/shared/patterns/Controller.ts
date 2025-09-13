import { FastifyReply, FastifyRequest, RawServerDefault, RouteGenericInterface } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { IncomingMessage, ServerResponse } from 'http';
import { ZodTypeAny } from "zod";

export type TypedRequest<
    BodySchema extends ZodTypeAny,
    ParamsSchema extends ZodTypeAny,
    QuerySchema extends ZodTypeAny
> = FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    IncomingMessage,
    {
        readonly body: BodySchema;
        readonly params: ParamsSchema;
        readonly querystring: QuerySchema;
    }, ZodTypeProvider
>;

export type TypedResponse<
    Responses extends Record<200, ZodTypeAny>
> = FastifyReply<
    RouteGenericInterface,
    RawServerDefault,
    IncomingMessage,
    ServerResponse,
    unknown,
    {
        response: Responses
    },
    ZodTypeProvider
>;

export interface Controller<
    ReqBody extends ZodTypeAny,
    Params extends ZodTypeAny,
    Query extends ZodTypeAny,
    ResBody extends Record<number, ZodTypeAny>
> {
    handle(request: TypedRequest<ReqBody, Params, Query>, response: TypedResponse<ResBody>): void;
}