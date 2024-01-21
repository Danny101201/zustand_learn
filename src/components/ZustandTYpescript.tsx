import React from 'react'
import {
  StateCreator,
  create,
} from 'zustand'
import { devtools, persist } from 'zustand/middleware'
// declare const create: <T>(f: (get: () => T) => T) => T
// x will be unknown because ts can't infer witch T come from
// const x = create((get) => ({
//   foo: 0,
//   bar: () => get()
// }))

const myMiddlewares = (f) => devtools(persist(f, { name: 'bearStore' }))
interface BearState {
  bears: number
  increase: (by: number) => void
}


interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

interface SharedSlice {
  addBoth: () => void
  getBoth: () => string
}
type BoundStoreSlice = BearSlice & FishSlice & SharedSlice
const createBearSlice: StateCreator<
  BoundStoreSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set(state => ({ bears: state.bears + 1 })),
  eatFish: () => set(state => ({ fishes: state.fishes - 1 }))
})
const createFishSlice: StateCreator<
  BoundStoreSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set(state => ({ fishes: state.fishes + 1 }))
})
const createSharedSlice: StateCreator<
  BoundStoreSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    get().addBear()
    get().addFish()
  },
  getBoth: () => `bears: ${get().bears} and fishes: ${get().fishes}`
})
const useBoundStore = create<BoundStoreSlice>((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))


export const ZustandTYpescript = () => {
  const { bears, fishes, getBoth, addBear, addFish, eatFish, addBoth } = useBoundStore()
  const store = getBoth()
  return (
    <div>
      <p>bears : {bears}</p>
      <p>fishes : {fishes}</p>
      <p>store : {store}</p>
      <button onClick={addBear}>addBear</button>
      <button onClick={addFish}>addFish</button>
      <button onClick={eatFish}>eatFish</button>
      <button onClick={addBoth}>addBoth</button>
    </div>
  )
}
