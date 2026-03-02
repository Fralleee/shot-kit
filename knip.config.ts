import type { KnipConfig } from "knip";

const config: KnipConfig = {
    $schema: "https://unpkg.com/knip@5/schema.json",
    ignore: [],
    ignoreDependencies: [],
    paths: {
        "@/*": ["./src/*"],
    },
    rules: {
        files: "error",
        exports: "error",
        dependencies: "error",
        unlisted: "error",
        types: "error",
        binaries: "off",
    },
    typescript: true,
};

export default config;
