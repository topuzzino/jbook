import MonacoEditor from '@monaco-editor/react'

const CodeEditor = () => (
  <MonacoEditor
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

export default CodeEditor
