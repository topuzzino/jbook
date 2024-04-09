import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import bundle from './bundler'

const el = document.getElementById('root')
const root = ReactDOM.createRoot(el!)

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const handleClick = async () => {
    const output = await bundle(input)
    setCode(output)
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
