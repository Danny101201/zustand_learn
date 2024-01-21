import React, { useEffect, useState } from 'react'
import { create } from 'zustand'
type MapInfo = {
  name: string,
  age: number
}
type GetObjectValueType<T> = T extends Record<string, unknown> ? T[keyof T] : T
interface UseFooProps {
  foo: Map<string, MapInfo>,
  bar: Set<string>,
  getFoo: <ReturnType extends Partial<MapInfo> | GetObjectValueType<MapInfo>>(selector: (state: MapInfo) => ReturnType) => ReturnType[]
}
const useFoo = create<UseFooProps>((set, get) => ({
  foo: new Map(),
  bar: new Set(),
  getFoo: (selector) => {
    return Array.from(get().foo, ([key, values]) => selector(values))
  }
}))
const updateBar = (value: string) => {
  useFoo.setState(pre => ({
    bar: new Set(pre.bar).add(value)
  }))
}
const updateFoo = (age: string, name: string) => {
  useFoo.setState(pre => ({
    foo: new Map(pre.foo).set(`${name}-${age}`, { name, age })
  }))
}
const randomValue = (limit?: number) => Math.floor(Math.random() * (limit || 10))
export const SetMapStore = () => {
  const { foo, bar, getFoo } = useFoo()
  const nameList = getFoo<string>(state => state.name)
  const ageList = getFoo<number>(state => state.age)
  const allList = getFoo<{ ages: number, name: string }>(state => ({
    ages: state.age,
    name: state.name,
  }))

  return (
    <div>
      <p>SetMapStore</p>
      <p>bar : {bar}</p>
      <div>
        <p>allList</p>
        <div className='flex gap-5 flex-wrap'>
          {allList.map(list => (
            <div key={list.ages}>
              <div>{list.ages}</div>
              <div>{list.name}</div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <p>nameList</p>
        <div className='flex gap-5 flex-wrap'>
          {nameList.map((name, index) => (
            <div key={index}>
              <div>{name}</div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div>
        <p>ageList</p>
        <div className='flex gap-5 flex-wrap'>
          {ageList.map(age => (
            <div key={age}>
              <div>{age}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => updateBar(randomValue(100).toString())}>updateBar</button>
      <button onClick={() => updateFoo(randomValue(100).toString(), 'Danny')}>updateFoo</button>
    </div>
  )
}
