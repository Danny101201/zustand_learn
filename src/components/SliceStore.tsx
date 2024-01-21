import React from 'react'
import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

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
type BoundStoreSlice = SharedSlice & FishSlice & BearSlice

const createBearSlice: StateCreator<
  BearSlice & FishSlice & SharedSlice,
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
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
const createSharedSlice: StateCreator<
  BoundStoreSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => set((state) => ({ fishes: state.fishes + 1, bears: state.bears + 1 }),),
  getBoth: () => `bears: ${get().bears}  fishes: ${get().fishes}`
})
const useBoundStore = create<BoundStoreSlice>()(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
      ...createSharedSlice(...a),
    }),
    { name: 'bound-store' }
  )
)

export const SliceStore = () => {
  const { addBear, addFish, bears, fishes, eatFish, getBoth, addBoth } = useBoundStore()
  return (
    <div>
      <p>bears: {bears}</p>
      <p>fishes: {fishes}</p>
      <pre>{JSON.stringify(getBoth(), null, 2)}</pre>
      <button onClick={addBear}>addBear</button>
      <button onClick={addFish}>addFish</button>
      <button onClick={eatFish}>eatFish</button>
      <button onClick={addBoth}>addBoth</button>
    </div>
  )
}
