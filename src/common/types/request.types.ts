import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
} 