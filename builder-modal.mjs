import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["modal.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "dist/modal.js",
});
