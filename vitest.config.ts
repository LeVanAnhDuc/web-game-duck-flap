import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    /**
     * Mặc định chạy trong Node: toàn bộ logic game là hàm thuần nên
     * không cần DOM. File nào cần localStorage thì tự khai báo
     * `// @vitest-environment happy-dom` ở đầu file.
     */
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"]
  }
});
