// Cloudflare Worker 反向代理 v1.0
const ORIGIN = 'http://123.60.222.204';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const originUrl = ORIGIN + url.pathname + url.search;

    const headers = new Headers(request.headers);
    headers.set('Host', '123.60.222.204');
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Forwarded-Proto', 'https');

    const proxyReq = new Request(originUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual',
    });

    try {
      const response = await fetch(proxyReq);
      const respHeaders = new Headers(response.headers);
      respHeaders.delete('content-encoding');
      respHeaders.delete('content-length');
      respHeaders.delete('content-security-policy');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: respHeaders,
      });
    } catch (e) {
      return new Response('源站连接失败: ' + e.message, { status: 502 });
    }
  }
};
