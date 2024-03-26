import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const handleEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    })

    monacoEditor.getModel()?.updateOptions({
      tabSize: 2,
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
