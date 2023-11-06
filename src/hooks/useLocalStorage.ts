import { useState } from 'react'

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void

const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValue<T>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading local storage key "${key}":`, error)
            return initialValue
        }
    })

    const setValue: SetValue<T> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(`Error setting local storage key "${key}":`, error)
        }
    }

    return [storedValue, setValue]
}

export default useLocalStorage
