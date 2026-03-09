import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = randomUUID();
  const startTime = Date.now();

  req.headers['x-request-id'] = requestId;
  res.requestId = requestId;

  console.log({
    requestId,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  });

  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const duration = Date.now() - startTime;

    console.log({
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      productsCount: body?.metaData?.count || 0,
      metadata: body?.metaData,
      timestamp: new Date().toISOString(),
    });

    res.setHeader('X-Request-Id', requestId);
    return originalJson(body);
  };

  next();
};
