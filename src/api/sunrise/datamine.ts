import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";
import { xuidToHex } from "@/src/utils/xuid";

const DatamineSessionSchema = jsonStringifySchema(z.object({
    id: z.string(),
    sessionid: z.string(),
    build_string: z.string(),
    build_number: z.number(),
    systemid: z.string(),
    title: z.string(),
    session_start_date: z.coerce.date(),
    _count: z.object({
        events: z.number(),
    }),
}));

export type DatamineSession = z.infer<typeof DatamineSessionSchema>;

const DatamineSessionsResponseSchema = jsonStringifySchema(z.object({
    sessions: z.array(DatamineSessionSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
}));

const DatamineFilterOptionsSchema = jsonStringifySchema(z.object({
    buildStrings: z.array(z.string()),
}));

export const datamineFilterOptions = protectedProcedure.query(async (opts) => {
    const response = await sunrise2Axios.get('/datamine/sessions/filter-options', {
        headers: {
            'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
    
    // Handle Axios response - data might be a string that needs parsing
    let data = response.data;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    
    const parsed = DatamineFilterOptionsSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`datamineFilterOptions: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

export const datamineSessions = protectedProcedure.input(
    z.object({
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        buildString: z.string().optional(),
        systemId: z.string().optional(),
    })
).query(async ({ input, ctx }) => {
    const params = new URLSearchParams();
    params.append('page', String(input.page || 1));
    params.append('pageSize', String(input.pageSize || 20));
    if (input.buildString) {
        params.append('buildString', input.buildString);
    }
    if (input.systemId) {
        params.append('systemId', input.systemId);
    }
    
    const response = await sunrise2Axios.get(`/datamine/sessions?${params.toString()}`, {
        headers: {
            'x-xuid': xuidToHex(ctx.auth.user.xuid),
            'x-uhs': ctx.auth.user.xboxUserHash,
            'Authorization': ctx.auth.tokens.xsts,
        }
    });
    
    // Handle Axios response - data might be a string that needs parsing
    let data = response.data;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    
    const parsed = DatamineSessionsResponseSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`datamineSessions: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

const DatamineEventParameterSchema = jsonStringifySchema(z.object({
    id: z.string(),
    key: z.string(),
    type: z.enum(['LONG', 'INT64', 'FLOAT', 'STRING']),
    numeric_value: z.string().nullable(),
    string_value: z.string(),
}));

const DatamineEventSchema = jsonStringifySchema(z.object({
    event_index: z.number(),
    priority: z.number(),
    categories: z.array(z.string()),
    game_instance: z.string(),
    map: z.string(),
    event_date: z.coerce.date(),
    message: z.string(),
    parameters: z.array(DatamineEventParameterSchema),
}));

const DatamineSessionEventsResponseSchema = jsonStringifySchema(z.object({
    session: z.object({
        id: z.string(),
        sessionid: z.string(),
        build_string: z.string(),
        build_number: z.number(),
        systemid: z.string(),
        title: z.string(),
        session_start_date: z.coerce.date(),
    }),
    events: z.array(DatamineEventSchema),
}));

export const datamineSessionEvents = protectedProcedure.input(
    z.object({
        sessionId: z.string(),
        search: z.string().optional(),
    })
).query(async ({ input, ctx }) => {
    const params = new URLSearchParams();
    if (input.search) {
        params.append('search', input.search);
    }
    
    const queryString = params.toString();
    const url = `/datamine/sessions/${input.sessionId}/events${queryString ? `?${queryString}` : ''}`;
    
    const response = await sunrise2Axios.get(url, {
        headers: {
            'x-xuid': xuidToHex(ctx.auth.user.xuid),
            'x-uhs': ctx.auth.user.xboxUserHash,
            'Authorization': ctx.auth.tokens.xsts,
        }
    });
    
    // Handle Axios response - data might be a string that needs parsing
    let data = response.data;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    
    const parsed = DatamineSessionEventsResponseSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(`datamineSessionEvents: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

export const checkDatamineAccess = protectedProcedure.query(async (opts) => {
    const response = await sunrise2Axios.get('/user', {
        headers: {
            'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
    
    // Handle Axios response - data might be a string that needs parsing
    let data = response.data;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    
    return {
        hasAccess: data.datamineAccess === true,
    };
});

