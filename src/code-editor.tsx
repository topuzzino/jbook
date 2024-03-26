import MonacoEditor from '@monaco-editor/react'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const handleEditorDidMount = (getValue: () => string, monacoEditor: any) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    })
  }

  return (
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
  )
}

export default CodeEditor
