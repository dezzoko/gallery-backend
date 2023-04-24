import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveNullValuesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data
            .filter((item) => item !== null)
            .map((item) => {
              if (typeof item === 'object') {
                return this.filterObject(item);
              }
              return item;
            });
        }
        if (data && typeof data === 'object') {
          return this.filterObject(data);
        }
        return data;
      }),
    );
  }

  private filterObject(obj: Record<string, any>): Record<string, any> {
    const result = {};
    if (!Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null) {
          if (typeof value === 'object') {
            result[key] = this.filterObject(value);
          } else {
            result[key] = value;
          }
        }
      }
    } else {
      return obj
        .filter((item) => item !== null)
        .map((item) => {
          if (typeof item === 'object') {
            return this.filterObject(item);
          }
          return item;
        });
    }

    return result;
  }
}
