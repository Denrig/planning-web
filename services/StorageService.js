export const StorageService = {
  saveToStorage(key, value) {
    if (process.client) {
      localStorage.setItem(key, value)
    }
  },

  deleteFromStorage(key) {
    if (process.client) {
      localStorage.removeItem(key)
    }
  },

  getFromStorage(key) {
    if (process.client) {
      localStorage.getItem(key)
    }
  }
}