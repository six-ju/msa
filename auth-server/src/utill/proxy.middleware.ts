import { createProxyMiddleware } from 'http-proxy-middleware';

export function eventProxy() {
  return createProxyMiddleware({
    target: 'http://localhost:8002', 
    changeOrigin: true,
    pathRewrite: {
      '^/admin/event': '',
    },
  });
}
