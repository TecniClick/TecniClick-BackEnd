import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function ExcludeFieldsInterceptor(excludedFields: string[]) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (
            (data.createdUser && typeof data.createdUser === 'object') ||
            (data.admin && typeof data.admin === 'object')
          ) {
            const key = data.createdUser ? 'createdUser' : 'admin';
            return {
              ...data,
              [key]: Object.fromEntries(
                Object.entries(data[key]).filter(
                  ([k]) => !excludedFields.includes(k),
                ),
              ),
            };
          } else if (
            data &&
            typeof data === 'object' &&
            data.users &&
            Array.isArray(data.users)
          ) {
            return {
              ...data,
              users: data.users.map((user) => {
                const filteredUser = { ...user };
                excludedFields.forEach((field) => delete filteredUser[field]);
                return filteredUser;
              }),
            };
          } else if (Array.isArray(data)) {
            return data.map((user) => {
              const filteredUser = { ...user };
              excludedFields.forEach((field) => delete filteredUser[field]);
              return filteredUser;
            });
          } else if (typeof data === 'object' && data !== null) {
            const filteredUser = { ...data };
            excludedFields.forEach((field) => delete filteredUser[field]);
            return filteredUser;
          }

          return data;
        }),
      );
    }
  }
  return mixin(MixinInterceptor);
}
