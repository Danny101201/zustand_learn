import React from 'react'
import { create } from 'zustand'
interface BearStoreProps {
  bear: number
}
const bearStore = create<BearStoreProps>(() => ({
  bear: 0
}))
export const NoSToreAction = () => {
  const { bear } = bearStore()
  const addBear = () => bearStore.setState((state) => ({ bear: state.bear + 1 }))
  const deleteBear = () => bearStore.setState((state) => ({ bear: state.bear - 1 }))
  return (
    <div>
      <p>bear: {bear}</p>
      <button onClick={addBear}>addBear</button>
      <button onClick={deleteBear}>deleteBear</button>
    </div>
  )
}
