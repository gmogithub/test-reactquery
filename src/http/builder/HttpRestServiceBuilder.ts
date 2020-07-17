import {HttpMiddleware, HttpRestService} from "../HttpRestService";

export class HttpRestServiceBuilder {

  private middlewareBefore: Array<HttpMiddleware> = [];
  private middlewareSuccess: Array<HttpMiddleware> = [];
  private middlewareError: Array<HttpMiddleware> = [];
  private middlewareAfter: Array<HttpMiddleware> = [];
  private baseUrl: string = '';
  private headers: Headers | null = null;
  private generateApiResponse = false;

  public withGenerateApiResponse() : HttpRestServiceBuilder{
    this.generateApiResponse = true;
    return this;
  }

  public withHeaders(headers: Headers) : HttpRestServiceBuilder{
    this.headers = headers;
    return this;
  }

  public withBaseUrl(baseUrl: string): HttpRestServiceBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  public withMiddlewareBefore(middleware: Array<HttpMiddleware>): HttpRestServiceBuilder {
    this.middlewareBefore = middleware;
    return this;
  }

  public withMiddlewareAfter(middleware: Array<HttpMiddleware>): HttpRestServiceBuilder {
    this.middlewareAfter = middleware;
    return this;
  }

  public withMiddlewareSuccess(middleware: Array<HttpMiddleware>): HttpRestServiceBuilder {
    this.middlewareSuccess = middleware;
    return this;
  }

  public withMiddlewareError(middleware: Array<HttpMiddleware>): HttpRestServiceBuilder {
    this.middlewareError = middleware;
    return this;
  }

  public build(): HttpRestService {
    const httpRestService: HttpRestService = new HttpRestService();
    httpRestService.setBaseUrl(this.baseUrl);
    httpRestService.setGenerateApiResponse(this.generateApiResponse);
    httpRestService.setMiddlewareBefore(this.middlewareBefore);
    httpRestService.setMiddlewareSuccess(this.middlewareSuccess);
    httpRestService.setMiddlewareError(this.middlewareError);
    httpRestService.setMiddlewareAfter(this.middlewareAfter);
    if (this.headers !== null) {
      httpRestService.setHeaders(this.headers);
    }
    return httpRestService
  }
}