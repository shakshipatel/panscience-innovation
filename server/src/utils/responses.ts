const SERVER_RESPONSE = {
  SUCCESS: "success",
  CREATED: "created",
  NO_CONTENT: "no_content",
  BAD_REQUEST: "bad_request",
  ERROR: "error",
  FAIL: "fail",
  INVALID: "invalid",
  UNAUTHORIZED: "unauthorized",
  NOT_FOUND: "not_found",
  FORBIDDEN: "forbidden",
  CONFLICT: "conflict",
  UNPROCESSABLE_ENTITY: "unprocessable_entity",
  INTERNAL_SERVER_ERROR: "internal_server_error",
};

const SERVER_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

class SuccessResponse {
  status: any;
  data: any;
  message: any;
  response: any;
  constructor(data: any, message: any) {
    this.status = SERVER_STATUS.OK;
    this.data = data;
    this.message = message;
    this.response = SERVER_RESPONSE.SUCCESS;
  }

  static send(res: any, data: any, message: any) {
    return res.status(SERVER_STATUS.OK).json({
      status: SERVER_RESPONSE.SUCCESS,
      data,
      message,
    });
  }
}

class Response {
  status: number | undefined;
  data: any;
  message: any;
  response: any;
}

class CreatedResponse extends Response {
  constructor(data: any, message: any) {
    super();
    this.status = SERVER_STATUS.CREATED;
    this.data = data;
    this.message = message;
    this.response = SERVER_RESPONSE.CREATED;
  }

  static send(res: any, data: any, message: any) {
    return res.status(SERVER_STATUS.CREATED).json({
      status: SERVER_RESPONSE.CREATED,
      data,
      message,
    });
  }
}

class NoContentResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.NO_CONTENT;
    this.message = message;
    this.response = SERVER_RESPONSE.NO_CONTENT;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.NO_CONTENT).json({
      status: SERVER_RESPONSE.NO_CONTENT,
      message,
    });
  }
}

class BadRequestResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.BAD_REQUEST;
    this.message = message;
    this.response = SERVER_RESPONSE.BAD_REQUEST;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.BAD_REQUEST).json({
      status: SERVER_RESPONSE.BAD_REQUEST,
      message,
    });
  }
}

class UnauthorizedResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.UNAUTHORIZED;
    this.message = message;
    this.response = SERVER_RESPONSE.UNAUTHORIZED;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.UNAUTHORIZED).json({
      status: SERVER_RESPONSE.UNAUTHORIZED,
      message,
    });
  }
}

class ForbiddenResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.FORBIDDEN;
    this.message = message;
    this.response = SERVER_RESPONSE.FORBIDDEN;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.FORBIDDEN).json({
      status: SERVER_RESPONSE.FORBIDDEN,
      message,
    });
  }
}

class NotFoundResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.NOT_FOUND;
    this.message = message;
    this.response = SERVER_RESPONSE.NOT_FOUND;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.NOT_FOUND).json({
      status: SERVER_RESPONSE.NOT_FOUND,
      message,
    });
  }
}

class ConflictResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.CONFLICT;
    this.message = message;
    this.response = SERVER_RESPONSE.CONFLICT;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.CONFLICT).json({
      status: SERVER_RESPONSE.CONFLICT,
      message,
    });
  }
}

class UnprocessableEntityResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.UNPROCESSABLE_ENTITY;
    this.message = message;
    this.response = SERVER_RESPONSE.UNPROCESSABLE_ENTITY;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.UNPROCESSABLE_ENTITY).json({
      status: SERVER_RESPONSE.UNPROCESSABLE_ENTITY,
      message,
    });
  }
}

class InternalServerErrorResponse extends Response {
  constructor(message: any) {
    super();
    this.status = SERVER_STATUS.INTERNAL_SERVER_ERROR;
    this.message = message;
    this.response = SERVER_RESPONSE.INTERNAL_SERVER_ERROR;
  }

  static send(res: any, message: any) {
    return res.status(SERVER_STATUS.INTERNAL_SERVER_ERROR).json({
      status: SERVER_RESPONSE.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}

export {
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictResponse,
  UnprocessableEntityResponse,
  InternalServerErrorResponse,
};
