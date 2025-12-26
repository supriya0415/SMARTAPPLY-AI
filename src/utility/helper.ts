import cookie from 'js-cookie'

export const getLocalStorage = (key: string) => {
  if (window) {
    return localStorage.getItem(key)
  }
}
//set in localStorage
export const setLocalStorage = (key: string, value: string) => {
  if (window) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
//remove in localStorage
export const removeLocalStorage = (key: string) => {
  if (window) {
    localStorage.removeItem(key)
  }
}

//set in cookie
export const setcookie = (key: string, value: string) => {
  if (window) {
    cookie.set(key, value, {
      expires: 1,
    })
  }
}
//remove in cookie
export const removecookie = (key: string) => {
  if (window) {
    cookie.remove(key, {
      expires: 1,
    })
  }
}

//get cookie
export const getcookie = (key: string) => {
  if (window) {
    return cookie.get(key)
  }
}

//get data from localstorage
export const isAuth = () => {
  if (window) {
    try {
      const user = localStorage.getItem('user')
      const token = localStorage.getItem('jwt')
      
      if (!user || !token) {
        return false
      }
      
      // Check if user can be parsed as JSON
      const parsedUser = JSON.parse(user)
      
      // Check token expiration
      const expirationDate = localStorage.getItem('expirationDate')
      if (expirationDate) {
        const expDate = new Date(expirationDate)
        const now = new Date()
        if (now > expDate) {
          return false
        }
      }
      
      return !!(parsedUser && token)
    } catch (err) {
      return false
    }
  }
  return false
}

export const getLocalNotification = () => {
  if (window) {
    if (!localStorage.getItem('notification')) {
      return JSON.parse(localStorage.getItem('notification') ?? '')
    } else {
      return false
    }
  }
}
//store token and user data in storage
export const authenticate = (response: { data: string }) => {
  // response should include { user, token }
  if (response && (response as any).token) {
    // Store token directly without JSON.stringify wrapping
    localStorage.setItem('jwt', (response as any).token)
  }
  if (response && (response as any).user) {
    // Store user as JSON string
    localStorage.setItem('user', JSON.stringify((response as any).user))
  }

  const expirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 10 * 1000)
  localStorage.setItem('expirationDate', expirationDate.toISOString())
}

export const getToken = () => {
  return localStorage.getItem('jwt')
}

export const getUser = () => {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  } catch (err) {
    return null
  }
}
