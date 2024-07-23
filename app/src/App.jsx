import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

//pages import
import Home from './pages/homePage/home'
import NewPost from './pages/newPostPage/newPost'
import PendingPosts from './pages/pendingPosts/pendingPosts'
import ViewPost from './pages/viewPostPage/viewPost'
import AddBid from './pages/addBidPage/addBid.jsx'
import Profile from './pages/profilePage/profile.jsx'

import NotificationCmp from './components/notification/Notification.jsx'

export const ImageLoading = React.createContext()

function App() {
  const [loading, setLoading] = useState(true)
  const [showNotif, setShowNotif] = useState(false)

  useEffect(()=> {

    if (!loading){
      setShowNotif(true)
      setLoading(true)
    }

  }, [loading])

  return (
    <ImageLoading.Provider value={[loading, setLoading]} >

      {(showNotif) &&
        (<NotificationCmp title="Image Done" message="Your message is done loading" setShowNotif={setShowNotif}/>)
      }

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
    </ImageLoading.Provider>

  )
}

export default App
