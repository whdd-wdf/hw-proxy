// Cloudflare Pages Functions 反向代理
// 将所有请求代理到华为云 VPS，隐藏源站 IP
const ORIGIN = 'http://123.60.222.204';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const originUrl = ORIGIN + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set('Host', '123.60.222.204');
  headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
  headers.set('X-Forwarded-Proto', 'https');
  headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');

  const proxyReq = new Request(originUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'manual',
  });

  try {
    const response = await fetch(proxyReq);
    const respHeaders = new Headers(response.headers);
    // 让 Cloudflare 重新处理编码和长度
    respHeaders.delete('content-encoding');
    respHeaders.delete('content-length');
    // 防止源站的 CSP 阻止
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
