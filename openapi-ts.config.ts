import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5000/doc",
  output: "src/client",
  plugins: ["@hey-api/client-fetch"],
});
