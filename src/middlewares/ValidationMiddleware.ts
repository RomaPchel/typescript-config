import type { Context, Next } from "koa";
import { ZodError } from "zod";

export const ValidationMiddleware = (validator: { validateBody: (arg0: any) => void; }) => {
  return async (ctx: Context, next: Next) => {
    try {
      if (ctx.method !== "GET") {
        validator.validateBody(ctx.request);
      }
      await next();
    } catch (e) {
      if (e instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          errors: e.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        };
      } else {
        ctx.status = 500;
        ctx.body = { message: "Internal server error" };
      }
    }
  };
};
