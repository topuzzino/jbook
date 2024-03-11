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

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        }
      })

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const cachedResult = await fileChache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }

        const { data, request } = await axios.get(args.path)

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

        const contents = `
          const style = document.createElement('style')
          style.innerText = '${escaped}'
          document.head.appendChild(style)
        `

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await fileChache.setItem(args.path, result)

        return result
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileChache.getItem<esbuild.OnLoadResult>(
          args.path
        )

        if (cachedResult) {
          return cachedResult
        }

        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        }

        await fileChache.setItem(args.path, result)

        return result
      })
    },
  }
}
