import { CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CacheInterceptor extends NestCacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = ['/api/admin']; // Exclude admin routes from cache

    if (
      !isGetRequest ||
      (isGetRequest && excludePaths.some((path) => httpAdapter.getRequestUrl(request).includes(path)))
    ) {
      return undefined;
    }
    
    // Cache by URL
    return httpAdapter.getRequestUrl(request);
  }
}
