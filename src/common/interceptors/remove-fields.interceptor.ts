import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fieldsToRemove: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => {
            return this.removeFieldsFromItem(item);
          });
        } else {
          return this.removeFieldsFromItem(data);
        }
      }),
    );
  }

  private removeFieldsFromItem(body: any) {
    if (typeof body !== 'object' || body === null) {
      return;
    }

    for (const key in body) {
      if (this.fieldsToRemove.includes(key)) {
        delete body[key];
      } else {
        this.removeFieldsFromItem(body[key]); // Рекурсивный вызов для свойств
      }
    }
    return body;
  }
}
