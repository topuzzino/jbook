import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localforage from 'localforage'

const fileChache = localforage.createInstance({
  name: 'filecache',
})

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' }
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          }
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a',
        }
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          }
        }

        // CHeck to see if we've already fetched this file
        const cachedResult = await fileChache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        // and if it's in the cache, return it immediately
        if (cachedResult) {
          return cachedResult
        }

        const { data, request } = await axios.get(args.path)

        // store response in cache
        // as key we'll store args.path
        // as value we can use either data or the object under

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        // store response in cache
        await fileChache.setItem(args.path, result)

        return result
      })
    },
  }
}
