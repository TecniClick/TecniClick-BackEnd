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
            (data.user && typeof data.user === 'object') ||
            (data.createdUser && typeof data.createdUser === 'object') ||
            (data.admin && typeof data.admin === 'object')
          ) {
            let key: string;
            if (data.createdUser) {
              key = 'createdUser';
            } else if (data.admin) {
              key = 'admin';
            } else if (data.user) {
              key = 'user';
            }

            const filteredMain = Object.fromEntries(
              Object.entries(data[key]).filter(
                ([k]) => !excludedFields.includes(k),
              ),
            );

            return {
              ...data,
              [key]: filteredMain,
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
