import express, { type Express, Request, Response } from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import router from "./route";
import { logger } from "/lib/logger";

const app: Express = express();

app.use(
  pinoHttp.default({
    logger,
    serializers: {
      req(req: Request) {
        return {
          id: (req as any).id,
          method: req.method,
          url: req.url.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
