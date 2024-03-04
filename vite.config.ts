import * as fsPromises from "fs/promises";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import { defineConfig, Plugin } from "vite";

// swiped in its entirety from https://bringingfire.com/blog/intro-to-foundry-module-development

function updateModuleManifestPlugin(): Plugin {
 return {
   name: "update-module-manifest",
   async writeBundle(): Promise<void> {
     const moduleVersion = process.env.MODULE_VERSION;
     const githubProject = process.env.GH_PROJECT;
     const githubTag = process.env.GH_TAG;
     const manifestContents: string = await fsPromises.readFile(
       "src/module.json",
       "utf-8"
     );
     const manifestJson = JSON.parse(manifestContents) as Record<
           string,
           unknown
           >;

     if (moduleVersion) {
       manifestJson["version"] = moduleVersion;
     }

     if (githubProject) {
       const baseUrl = `https://github.com/${githubProject}/releases`;
       manifestJson["manifest"] = `${baseUrl}/latest/download/module.json`;
       if (githubTag) {
         manifestJson[
           "download"
         ] = `${baseUrl}/download/${githubTag}/module.zip`;
       }
     }

     await fsPromises.writeFile(
       "dist/module.json",
       JSON.stringify(manifestJson, null, 4)
     );
   },
 };
}

export default defineConfig({
 build: {
   sourcemap: true,
   rollupOptions: {
     input: "src/ts/module.ts",
     output: {
       entryFileNames: 'scripts/[name].js',
       format: "es",
     },
   },
 },
  plugins: [
   scss({
     fileName: "styles/module.css",
     sourceMap: true,
     watch: ["src/styles/*.scss"],
   }),
   copy({
     targets: [
       { src: "src/templates", dest: "dist" },
       { src: "src/languages", dest: "dist" },
       { src: "src/icons", dest: "dist" },
       { src: "README.md", dest: "dist" },
       { src: "LICENSE", dest: "dist" }
     ],
     hook: "writeBundle",
   }),
    updateModuleManifestPlugin()
 ],
});
