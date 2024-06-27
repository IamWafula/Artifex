import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import GenImage from './genImage/GenImage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>

        <GenImage/>

      </div>
    </>
  )
}

export default App
