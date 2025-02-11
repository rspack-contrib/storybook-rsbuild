import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'

const root = ReactDOMClient.createRoot(document.body)

function App() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
