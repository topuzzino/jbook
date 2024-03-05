import ReactDOM from 'react-dom/client'
import * as esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef, SetStateAction } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'

const el = document.getElementById('root')
const root = ReactDOM.createRoot(el!)

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  const ref = useRef<any>()

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
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
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    setCode(result.outputFiles[0].text)
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e: { target: { value: SetStateAction<string> } }) =>
          setInput(e.target.value)
        }
      />
      <div>
        <button onClick={() => handleClick()}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

root.render(<App />)
