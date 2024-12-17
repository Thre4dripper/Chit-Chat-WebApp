import { useState } from 'react'

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void

const useLocalStorage = <T>(key: string, fallbackValue: T): [T, SetValue<T>] => {
    const getStoredValue = (): T => {
        const item = localStorage.getItem(key)
        if (item === null || item === 'undefined' || item === 'null') {
            return fallbackValue
        }
        try {
            return JSON.parse(item) as T // Attempt to parse JSON
        } catch {
            return item as unknown as T // Fallback to plain string
        }
    }

    const [storedValue, setStoredValue] = useState<T>(getStoredValue)

    const setValue: SetValue<T> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            localStorage.setItem(
                key,
                typeof valueToStore === 'string' ? valueToStore : JSON.stringify(valueToStore)
            )
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }

    return [storedValue, setValue]
}

export default useLocalStorage
