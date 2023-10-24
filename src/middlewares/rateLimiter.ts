import {NextFunction, Request, Response} from "express";
const rateLimit = require("express-rate-limit");
import {ServerError} from "../errors";

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface HttpEndpoint {
  method: HttpMethod;
  normalizedPath: string;
}

const endpointLimits = [
  { endpoint: 'POST:/auth', max: 20, keyword: 'login' },
  { endpoint: 'POST:/users', max: 20, keyword: 'registration' },
  { endpoint: 'POST:/users/verification', max: 20, keyword: 'verification email' },
  { endpoint: 'PATCH:/users/verification/:token', max: 20, keyword: 'verification' },
  { endpoint: 'POST:/users/password-reset', max: 20, keyword: 'password reset email' },
  { endpoint: 'GET:/users/password-reset/:token', max: 20, keyword: 'password reset' },
  { endpoint: 'PATCH:/users/password-reset/:token', max: 20, keyword: 'password reset' },
  { endpoint: 'GET:/users', max: 40, keyword: 'user list' },
  { endpoint: 'PATCH:/users/:id/state-change', max: 20, keyword: 'user active state change' },
  { endpoint: 'GET:/workweeks/:date', max: 200, keyword: 'workweek fetch' },
  { endpoint: 'PATCH:/workweeks', max: 40, keyword: 'workweek approve' },
  { endpoint: 'POST:/workdays', max: 40, keyword: 'workday save' },
];

let endpointRateLimiters: any;
(async () => {
  // Set up rate limiters for each endpoint specified in endpointLimits
  endpointRateLimiters = endpointLimits.reduce((acc, { endpoint, max, keyword }) =>
    ({...acc, [endpoint]: rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max, // Limit each IP to n requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: `Too many ${keyword} requests created, please try again in 10 minutes.`
    })}), {});
})();

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const endpoint = getEndpointAsKey(req);

    if (!(endpoint in endpointRateLimiters)) {
      throw new ServerError(`Rate limiting requested but not specified for endpoint "${endpoint}".`);
    }

    return endpointRateLimiters[endpoint as keyof typeof endpointRateLimiters](req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

const getEndpointAsKey = (req: Request) => Object.values(getEndpoint(req)).join(':');

const getEndpoint = (req: Request): HttpEndpoint => ({
  method: (req.method as HttpMethod),
  normalizedPath: normalizePath(req)
});

const normalizePath = (req: Request): string => {
  let { path } = req;
  for (const key in req.params) {
    const value = req.params[key];
    path = path.replace(value, `:${key}`);
  }
  return path;
};

export {
  rateLimiter
};
