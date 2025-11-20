import { join } from "path";
import { rm } from "fs/promises";

import { build } from "esbuild";
import { glob } from "glob";

async function main() {
    const DIST = "./bedrock-server/development_behavior_packs/bp/scripts";
    const SRC = "./addons/behavior/scripts";

    await rm(DIST, { recursive: true, force: true });

    await build({
        entryPoints: (
            await glob("**/*.{js,ts,json}", {
                cwd: SRC,
                nodir: true
            })
        ).map((file) => join(SRC, file)),
        bundle: false,
        outdir: DIST,
        format: "esm",
        allowOverwrite: true,
        plugins: []
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
