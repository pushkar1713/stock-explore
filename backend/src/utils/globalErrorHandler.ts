import { type Request, type Response } from "express";

export class BaseError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }

  public toJSON() {
    return {
      status: "error",
      code: this.code,
      message: this.message,
      ...(typeof this.details === "object" && this.details !== null
        ? { details: this.details }
        : {}),
    };
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Only consultants can perform this action") {
    super(403, "FORBIDDEN", message);
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super(404, "NOT_FOUND", `${resource}`);
  }
}

export class InternalServerError extends BaseError {
  constructor(error?: any) {
    super(
      500,
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      process.env.NODE_ENV === "development" ? error : undefined
    );
  }
}

export const isBaseError = (error: unknown): error is BaseError => {
  return error instanceof BaseError;
};

export const handleError = (error: unknown, res: Response): void => {
  console.error("Error:", error);

  const baseError = isBaseError(error) ? error : new InternalServerError(error);

  res.status(baseError.statusCode).json(baseError.toJSON());
};

export const ErrorFactory = {
  forbidden: (message?: string) => new ForbiddenError(message),
  notFound: (resource: string) => new NotFoundError(resource),
  internal: (error?: unknown) => new InternalServerError(error),
};

export const globalErrorHandler = (
  error: Error | BaseError,
  req: Request,
  res: Response
): void => {
  console.error("Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof BaseError && {
      statusCode: error.statusCode,
      code: error.code,
      details: error.details,
    }),
  });

  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  const internalError = {
    status: "error",
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  res.status(500).json(internalError);
};
