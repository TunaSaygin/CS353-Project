import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar/navbar'
import LoginForm from './components/loginbox/login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      {/* <div className="container mt-5">
        <h1>Welcome to My App</h1>
      </div> */}
      <LoginForm/>
    </>
  )
}

export default App
