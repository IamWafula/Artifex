import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

//pages import
import Home from './pages/homePage/home'
import NewPost from './pages/newPostPage/newPost'
import PendingPosts from './pages/pendingPosts/pendingPosts'
import ViewPost from './pages/viewPostPage/viewPost'
import AddBid from './pages/addBidPage/addBid.jsx'
import Profile from './pages/profilePage/profile.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-posts" element={<Home />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/pending" element={<PendingPosts />} />
        <Route path="/post/:id" element={<ViewPost/>} />
        <Route path="/bid/:id" element={<AddBid/>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </Router>
  )
}

export default App
