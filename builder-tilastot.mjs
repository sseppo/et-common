import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["tilastot.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "dist/tilastot.js",
});
