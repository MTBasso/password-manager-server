import type { NextFunction, Request, Response } from 'express';
import { type VerifyErrors, verify } from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '../../errors/Error';

export const authenticateToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authToken = request.headers.authorization;

  if (!authToken)
    return next(new UnauthorizedError('Authorization header missing'));

  if (authToken.startsWith('Bearer ')) {
    const token = authToken.split(' ')[1];

    verify(
      token,
      process.env.JWT_SECRET ?? '',
      (err: VerifyErrors | null, decodedToken: any) => {
        if (err) {
          console.error('Invalid token:', err.message);
          return next(new UnauthorizedError('Invalid token'));
        }
        request.user = {};
        request.user.id = decodedToken.userId;
        next();
      },
    );
  } else {
    return next(new UnauthorizedError('Invalid token format'));
  }
};

export const verifyUserId = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    if (!request.params.userId)
      return response.status(400).json({
        BadRequestError: 'User id is missing from the url parameters',
      });

    if (request.user === undefined)
      return response
        .status(400)
        .json({ BadRequestError: "This request's user is undefined" });

    if (request.user.id !== request.params.userId)
      return response.status(401).json({
        UnauthorizedError: 'Token user ID does not match request user ID',
      });

    next();
  } catch {
    return response
      .status(401)
      .json({ UnauthorizedError: 'User ID verification failed.' });
  }
};
