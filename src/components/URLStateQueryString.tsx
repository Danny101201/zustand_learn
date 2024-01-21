import { create } from 'zustand'
import { faker } from '@faker-js/faker';
import { querystring } from 'zustand-querystring';
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
const usaeLocalAndUrlStore = create<LocalAndUrlStore>()(
  querystring(
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
    {
      // the url option is used to provide the request url on the server side render
      url: '/',
      //  the select option controls what part of the state is synced with the query string
      select: () => {
        return {
          typesOfFish: true,
          numberOfBears: true
        }
      },
      key: '*'
    }
  )
)

export const URLStateQueryString = () => {
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
