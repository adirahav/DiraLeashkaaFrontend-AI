import { StateCreator } from 'zustand'
import { RootState } from '../store'
import { Property, HomeResponse } from '../../types'

export interface HomeSlice {
  properties: Property[]
  bestYields: Property[] | null
  fullData: boolean
  setHome: (data: HomeResponse) => void
  removeProperty: (uuid: string) => void
  restoreProperty: (property: Property, index: number) => void
}

export const createHomeSlice: StateCreator<RootState, [], [], HomeSlice> = (set) => ({
  properties: [],
  bestYields: null,
  fullData: false,

  setHome: (data) =>
    set((state) => {
      if (data.fullData) {
        // Phase 2: merge calculated fields into existing Phase 1 properties by uuid
        const mergedProperties = state.properties.map((existing) => {
          const updated = data.properties.find((p) => p.uuid === existing.uuid)
          return updated ?? existing
        })
        return {
          properties: mergedProperties,
          bestYields: data.bestYields ?? state.bestYields,
          fullData: true,
        }
      }
      // Phase 1: populate basic list
      return {
        properties: data.properties,
        fullData: false,
      }
    }),

  removeProperty: (uuid) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.uuid !== uuid),
      bestYields: state.bestYields?.filter((p) => p.uuid !== uuid) ?? null,
    })),

  restoreProperty: (property, index) =>
    set((state) => {
      const restored = [...state.properties]
      restored.splice(index, 0, property)
      return { properties: restored }
    }),
})
