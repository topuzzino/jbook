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
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' }
      })

      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        }
      })

      build.onResolve({ filter: /.*/ }, async (args: any) => {
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
        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx'

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const contents =
          fileType === 'css'
            ? `
          const style = document.createElement('style')
          style.innerText = '${escaped}'
          document.head.appendChild(style)
        `
            : data

        // store response in cache
        // as key we'll store args.path
        // as value we can use either data or the object under

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        // store response in cache
        await fileChache.setItem(args.path, result)

        return result
      })
    },
  }
}
