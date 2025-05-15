import { createProxyMiddleware } from 'http-proxy-middleware';

export function eventProxy() {
  return createProxyMiddleware({
    target: 'http://localhost:8001', 
    changeOrigin: true,
    pathRewrite: {
      '^/admin/event': '',
    },
  });
}
