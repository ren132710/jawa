//make localStorage.getItem thenable
export function getLocalStorage(key) {
  return new Promise((resolve, reject) => {
    const data = JSON.parse(localStorage.getItem(key))
    resolve(data)
    reject('Error getting localStorage')
  })
}

//make localStorage.setItem thenable
export function setLocalStorage(key, value) {
  return new Promise((resolve, reject) => {
    resolve(localStorage.setItem(key, JSON.stringify(value)))
    reject('Error setting localStorage')
  })
}
