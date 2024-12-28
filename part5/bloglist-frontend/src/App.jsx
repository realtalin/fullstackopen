import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ text: null, error: null })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('Logged in!', false)
    } catch (error) {
      showNotification(error.response.data.error, true)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const showNotification = (text, error) => {
    setNotification({ text: text, error: error })
    setTimeout(() => {
      setNotification({ text: null, error: null })
    }, 5000)
  }

  return (
    <div>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <>
          {user.name} logged in
          <button type="button" onClick={handleLogout}>
            logout
          </button>
          <BlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            showNotification={showNotification}
          />
          <BlogList blogs={blogs} />
        </>
      )}
    </div>
  )
}

export default App
