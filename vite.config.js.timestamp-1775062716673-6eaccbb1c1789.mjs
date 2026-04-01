// vite.config.js
import { defineConfig } from "file:///D:/grevia%20main%202/node_modules/vite/dist/node/index.js";
import laravel from "file:///D:/grevia%20main%202/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///D:/grevia%20main%202/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/grevia%20main%202/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\grevia main 2";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    laravel({
      input: ["resources/js/react/main.tsx"],
      refresh: true
    }),
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./resources/js/react")
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxncmV2aWEgbWFpbiAyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxncmV2aWEgbWFpbiAyXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9ncmV2aWElMjBtYWluJTIwMi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGxhcmF2ZWwgZnJvbSAnbGFyYXZlbC12aXRlLXBsdWdpbic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFsncmVzb3VyY2VzL2pzL3JlYWN0L21haW4udHN4J10sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3Jlc291cmNlcy9qcy9yZWFjdFwiKSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICAgICAgcG9ydDogNTE3MyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVwiOiBcInNhbWUtb3JpZ2luLWFsbG93LXBvcHVwc1wiLFxuICAgICAgICAgICAgXCJDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5XCI6IFwidW5zYWZlLW5vbmVcIlxuICAgICAgICB9LFxuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBME8sU0FBUyxvQkFBb0I7QUFDdlEsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFKaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QyxTQUFTO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDSixPQUFPLENBQUMsNkJBQTZCO0FBQUEsTUFDckMsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsRUFDOUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxJQUN2RDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNMLDhCQUE4QjtBQUFBLE1BQzlCLGdDQUFnQztBQUFBLElBQ3BDO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDWjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
