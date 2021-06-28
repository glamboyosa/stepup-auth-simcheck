import { createContext, useState } from 'react'

const AuthContext = createContext({
  screen: '',
  setScreen: (value) => {},
})

const AuthContextProvider = ({ children }) => {
  const [screen, setScreen] = useState('register')

  return (
    <AuthContextProvider value={{ screen, setScreen }}>
      {children}
    </AuthContextProvider>
  )
}

export { AuthContext }
export default AuthContextProvider
