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

// Normalise a raw API property: extract image URLs from media[] when images[] is absent
function normalizeProperty(raw: any): Property {
  const mediaUrls: string[] = (raw.media ?? [])
    .filter((m: any) => m.type === 'image')
    .map((m: any) => m.url as string)
  return {
    ...raw,
    images: raw.images?.length ? raw.images : mediaUrls,
  }
}

export const createHomeSlice: StateCreator<RootState, [], [], HomeSlice> = (set) => ({
  properties: [],
  bestYields: null,
  fullData: false,

  setHome: (data) =>
    set((state) => {
      const incoming = data.properties ?? []
      const normalizedBest = data.bestYields?.map(normalizeProperty) ?? null

      if (data.fullData && state.properties.length > 0) {
        // Phase 2: merge calculated fields into existing properties by uuid
        const merged = state.properties.map((existing) => {
          const updated = incoming.find((p) => p.uuid === existing.uuid)
          return updated ? normalizeProperty(updated) : existing
        })
        console.log(`[STORE] setHome merge: ${merged.length} properties (state=${state.properties.length}, incoming=${incoming.length})`)
        return {
          properties: merged,
          bestYields: normalizedBest ?? state.bestYields,
          fullData: true,
        }
      }

      // Phase 1 — or fullData:true arrived before any properties in the store
      // (Android: server may return fullData:true even for Phase 1 call)
      const normalized = incoming.map(normalizeProperty)
      console.log(`[STORE] setHome populate: ${normalized.length} properties, fullData=${data.fullData}`)
      return {
        properties: normalized,
        bestYields: normalizedBest ?? state.bestYields,
        fullData: data.fullData,
      }
    }),

  removeProperty: (uuid) => {
    console.log(`[STORE] Property removed from home list: ${uuid}`)
    set((state) => ({
      properties: state.properties.filter((p) => p.uuid !== uuid),
      bestYields: state.bestYields?.filter((p) => p.uuid !== uuid) ?? null,
    }))
  },

  restoreProperty: (property, index) => {
    console.log(`[STORE] Property restored at index ${index}: ${property.uuid}`)
    set((state) => {
      const restored = [...state.properties]
      restored.splice(index, 0, property)
      return { properties: restored }
    })
  },
})
