import { useState } from "react"
import { useUser } from "../../api"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/reducers/userSlice"

// minimal login email, password
const Login = () => {
  const dispatch = useDispatch()

  const { login } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    login({ email, password }, (res, err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(res?.data)
        dispatch(setUser(res?.data));
      }
    })
  }

  return (
    <div>
      Login Page
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login