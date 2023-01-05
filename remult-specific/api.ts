import { createRemultServer } from "remult/server";
import { requireUserId } from "../app/session.server";
import { Note } from "../app/models/note";
import type { ActionArgs } from "@remix-run/node";

export const api = createRemultServer<Request>({
  entities: [Note],
  getUser: async (request) => ({ id: await requireUserId(request) }),
});
export function withRemult<args extends ActionArgs, result>(
  what: (args: args) => result
) {
  return (args: args) => {
    return new Promise<result>(async (resolve, reject) => {
      api.withRemult(args.request, undefined!, async () => {
        try {
          resolve(await what(args));
        } catch (error: any) {
          reject(error);
        }
      });
    });
  };
}
