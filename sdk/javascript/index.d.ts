export interface Article {title: string; url: string; description: string; text: string; markdown: string}
export interface RenderOptions {format?: 'png' | 'jpeg' | 'webp' | 'pdf' | 'markdown' | 'text' | 'html' | 'json'; width?: number; height?: number; scale?: number; full_page?: boolean; quality?: number; wait?: number; timeout?: number; selector?: string; javascript?: boolean; mobile?: boolean; method?: 'GET' | 'POST'}
export interface RequestOptions {query?: Record<string, unknown>; method?: string; body?: BodyInit | Record<string, unknown>; headers?: HeadersInit; check?: boolean; redirect?: RequestRedirect}
export class APIError extends Error {status: number; body: string}
export class Microbrowser {
  constructor(options?: {baseUrl?: string; timeout?: number; fetch?: typeof globalThis.fetch});
  url(path: string, query?: Record<string, unknown>): string;
  request(path: string, options?: RequestOptions): Promise<Response>;
  render(url: string, options?: RenderOptions): Promise<Response>;
  markdown(url: string, options?: RenderOptions): Promise<string>;
  text(url: string, options?: RenderOptions): Promise<string>;
  article(url: string, options?: RenderOptions): Promise<Article & {status: number}>;
  screenshot(url: string, options?: RenderOptions & {format?: 'png' | 'jpeg' | 'webp'}): Promise<Uint8Array>;
  pdf(url: string, options?: RenderOptions): Promise<Uint8Array>;
}
