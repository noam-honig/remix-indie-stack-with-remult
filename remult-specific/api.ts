import { createRemultServer } from "remult/server";
import { getUserId } from "../app/session.server";
import { Note } from "../app/models/note";
import { ActionArgs, redirect } from "@remix-run/node";
import { remult } from "remult";

export const api = createRemultServer<Request>({
  entities: [Note],
  getUser: async (request) => {
    let id = await getUserId(request);
    if (id) return { id };
    return undefined!;
  },
});
export function withRemult<args extends ActionArgs, result>(
  what: (args: args) => result
) {
  return (args: args) =>
    new Promise<result>(async (resolve, reject) => {
      api.withRemult(args.request, undefined!, async () => {
        try {
          if (!remult.authenticated()) {
            const redirectTo = new URL(args.request.url).pathname;
            const searchParams = new URLSearchParams([
              ["redirectTo", redirectTo],
            ]);
            throw redirect(`/login?${searchParams}`);
          }
          resolve(await what(args));
        } catch (error: any) {
          reject(error);
        }
      });
    });
}
