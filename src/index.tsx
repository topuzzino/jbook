import ReactDOM from 'react-dom/client'
import * as esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef, SetStateAction } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import CodeEditor from './code-editor'
import Preview from './preview'

const el = document.getElementById('root')
const root = ReactDOM.createRoot(el!)

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  const ref = useRef<any>()

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  useEffect(() => {
    startService()
  }, [])

  const handleClick = async () => {
    if (!ref.current) {
      return
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    setCode(result.outputFiles[0].text)
  }

  return (
    <div>
      <CodeEditor initialValue={input} onChange={(value) => setInput(value)} />
      <div>
        <button onClick={() => handleClick()}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  )
}

root.render(<App />)
