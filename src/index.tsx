import ReactDOM from 'react-dom/client'
import CodeCell from './CodeCell'

const el = document.getElementById('root')
const root = ReactDOM.createRoot(el!)

const App = () => {
  return (
    <div>
      <CodeCell />
    </div>
  )
}

root.render(<App />)
