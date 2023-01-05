import { createRemultServer } from 'remult/server';
import { requireUserId } from '../app/session.server';
import { Note } from '../app/models/note';
import type { ActionArgs, SerializeFrom, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";

export const api = createRemultServer<Request>({
  entities: [Note],
  getUser: async request => ({ id: await requireUserId(request) })
});
export function withRemult<args extends ActionArgs, result>(what: (a: args) => result) {
  return async (z: args) => {
    return await new Promise<result>(async (res, reject) => {
      api.withRemult(z.request, undefined!, async () => {
        try {
          res(await what(z));
        } catch (error: any) {
          reject(error);
        }
      });
    });
  };
}