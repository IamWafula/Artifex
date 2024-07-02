import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

//pages import
import Home from './pages/homePage/home'
import NewPost from './pages/newPostPage/newPost'
// import PendingPosts from './pages/pendingPosts/pendingPosts'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-posts" element={<Home />} />
        <Route path="/new-post" element={<NewPost />} />

      </Routes>

    </Router>
  )
}

export default App
