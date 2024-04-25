import { useState } from 'react'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import bundle from './bundler'
import Resizable from './Resizable'

const CodeCell = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  // const handleClick = async () => {
  //   const output = await bundle(input)
  //   setCode(output)
  // }

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <CodeEditor
          initialValue={input}
          onChange={(value) => setInput(value)}
        />
        {/* <div>
          <button onClick={() => handleClick()}>Submit</button>
        </div> */}
        <Preview code={code} />
      </div>
    </Resizable>
  )
}
export default CodeCell
