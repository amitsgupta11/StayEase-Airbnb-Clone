export const sendSuccess = (res, { statusCode=200, message="Success", data=null, pagination=null }={}) => {
  const r = { success: true, message };
  if (data !== null) r.data = data;
  if (pagination) r.pagination = pagination;
  return res.status(statusCode).json(r);
};

export const sendError = (res, { statusCode=500, message="Something went wrong", errors=null }={}) => {
  const r = { success: false, message };
  if (errors) r.errors = errors;
  return res.status(statusCode).json(r);
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
