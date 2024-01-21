import { produce } from 'immer'
import React, { useState } from 'react'
import { create } from 'zustand'

type State = {
  deep: {
    nested: {
      obj: { count: number, name: string[] }
    }
  },
  normalInc: () => void,
  immerInc: () => void,
  normalAddText: (name: string) => void,
  immerIncAddText: (name: string) => void,
}
const useCountStore = create<State>((set) => ({
  deep: {
    nested: {
      obj: { count: 0, name: [] }
    }
  },
  normalInc: () => set((state) => ({
    ...state,
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1
        }
      }
    }
  })),
  immerInc: () => set(
    produce((state: State) => {
      state.deep.nested.obj.count++
    })
  ),
  normalAddText: (name: string) => set((state) => ({
    ...state,
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          name: [
            ...state.deep.nested.obj.name,
            name
          ]
        }
      }
    }
  })),
  immerIncAddText: (name) => set((state) =>
    produce(state, (state) => {
      state.deep.nested.obj.name.push(name)
    })
  )
}))

export const DeepNestStore = () => {
  const { deep, normalInc, immerInc, normalAddText, immerIncAddText } = useCountStore()
  const [text, setText] = useState<string>('')
  return (
    <div>
      <pre>{JSON.stringify(deep.nested.obj, null, 2)}</pre>
      <button onClick={normalInc}>normalInc</button>
      <button onClick={immerInc}>immerInc</button>
      <div>
        <label htmlFor="normalAddText">normalAddText</label>
        <div>
          <input type="text" id="normalAddText" onChange={e => setText(e.target.value)} value={text} />
        </div>
        <button onClick={() => normalAddText(text)}>normalAddText</button>
        <button onClick={() => immerIncAddText(text)}>immerIncAddText</button>
      </div>
    </div>
  )
}
