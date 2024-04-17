import { useState } from 'react'
import CodeEditor from './CodeEditor'
import Preview from './preview'
import bundle from './bundler'

const CodeCell = () => {
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
export default CodeCell
