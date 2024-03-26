import { useRef } from 'react'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>()

  const handleEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    })

    monacoEditor.getModel()?.updateOptions({
      tabSize: 2,
    })
  }

  const handleClick = () => {
    // get current value from editor
    const unformated = editorRef.current.getModel().getValue()

    // format that value
    const formated = prettier.format(unformated, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    })
    // set the formatted value back
    editorRef.current.setValue(formated)
  }

  return (
    <div>
      <button onClick={handleClick}>Format</button>
      <MonacoEditor
        value={initialValue}
        editorDidMount={handleEditorDidMount}
        language='javascript'
        height={200}
        theme='dark'
        options={{
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
