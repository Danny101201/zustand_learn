import { create } from 'zustand'
import { faker } from '@faker-js/faker';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';
import { useEffect } from 'react';
const getUrlSearch = () => {
  // replace ? string
  return window.location.search.slice(1)
}
const buildURLSuffix = (params: LocalAndUrlStoreStateTYpe, version = '0') => {
  const searchParams = new URLSearchParams()
  const zustandStoreParams = {
    state: {
      typesOfFish: params.typesOfFish,
      numberOfBears: params.numberOfBears,
    },
    version
  }
  searchParams.set('fishAndBearsStore', JSON.stringify(zustandStoreParams))
  return searchParams.toString()
}
const buildShareableUrl = (params: LocalAndUrlStoreStateTYpe, version = '0') => {
  return `${window.location.origin}?${buildURLSuffix(params, version)}`
}

const persistentStorage: StateStorage = {
  getItem: (key) => {
    const state = localStorage.getItem(key)
    return JSON.parse(state as string)
    // if (!getUrlSearch()) return JSON.parse(localStorage.getItem(key) as string)
    // const searchParams = new URLSearchParams(getUrlSearch());
    // return JSON.parse(searchParams.toString())
  },
  setItem: (key, newValue) => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.set(key, JSON.stringify(newValue))
    const { state, version } = JSON.parse(newValue) as { state: LocalAndUrlStoreStateTYpe, version: string }
    window.history.pushState(buildShareableUrl(state, version))
    localStorage.setItem(key, JSON.stringify(newValue))
  },
  removeItem: (key) => {
    const searchParams = new URLSearchParams(getUrlSearch())
    searchParams.delete(key)
    localStorage.removeItem(key)
    window.location.search = searchParams.toString()
  },
}
type LocalAndUrlStoreStateTYpe = {
  typesOfFish: string[]
  numberOfBears: number

}
type LocalAndUrlStore = {
  addTypeOfFish: (fishType: string) => void
  setNumberOfBears: (newNumber: number) => void
  reset: () => void
} & LocalAndUrlStoreStateTYpe
const initialValue: LocalAndUrlStoreStateTYpe = {
  typesOfFish: [],
  numberOfBears: 0
}
const storageOptions: PersistOptions<LocalAndUrlStore> = {
  name: 'fishAndBearsStore', // name of the item in the storage (must be unique)
  storage: createJSONStorage<LocalAndUrlStore>(() => persistentStorage), // (optional) by default, 'localStorage' is used
}
const usaeLocalAndUrlStore = create<LocalAndUrlStore>()(
  persist(
    (set) => ({
      ...initialValue,
      addTypeOfFish: (type) => {
        set(state => ({
          typesOfFish: [...state.typesOfFish, type]
        }))
      },
      setNumberOfBears: (newNumber) => {
        set(() => ({
          numberOfBears: newNumber
        }))
      },
      reset: () => {
        set(() => initialValue)
      }
    }),
    storageOptions,
  )
)

export const URLState = () => {
  const { typesOfFish, addTypeOfFish, setNumberOfBears, numberOfBears, reset } = usaeLocalAndUrlStore()
  return (
    <div>
      <p>typesOfFish</p>
      <pre>{JSON.stringify(typesOfFish, null, 2)}</pre>
      <p>numberOfBears</p>
      <div>{numberOfBears}</div>
      <button onClick={() => addTypeOfFish(faker.animal.fish())}>addTypeOfFish</button>
      <button onClick={() => setNumberOfBears(Number(faker.string.numeric({ length: { max: 3, min: 2 } })))}>setNumberOfBears</button>
      <button onClick={reset}>reset</button>
    </div >
  )
}
