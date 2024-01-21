import { create } from 'zustand'
import { faker } from '@faker-js/faker';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { StateStorage } from 'zustand/middleware';
const persistentStorage: StateStorage = {
  getItem: (key) => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    return JSON.parse(searchParams.get(key) ?? '')
  },
  setItem: (key, newValue) => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.set(key, JSON.stringify(newValue))
    location.hash = searchParams.toString()
  },
  removeItem: (key) => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.delete(key)
    location.hash = searchParams.toString()
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

export const URLStateHash = () => {
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
