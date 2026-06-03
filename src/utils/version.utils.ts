function parseVersion(v: string): [number, number, number] {
  const parts = v.trim().replace(/^v/i, '').split('.').map((s) => {
    const n = parseInt(s, 10)
    return isNaN(n) ? 0 : n
  })
  const [maj = 0, min = 0, patch = 0] = parts
  return [maj, min, patch]
}

/**
 * Returns true only when storeVersion is a patch-only increment over localVersion.
 * Major and Minor must be equal; store Patch must be strictly greater.
 * e.g. local=2.5.11 store=2.5.12 → true
 *      local=2.5.11 store=2.6.0  → false (minor bump → ForceUpgrade territory)
 */
export function isPatchOnlyUpgrade(local: string, store: string): boolean {
  if (!local || !store) return false
  const [lMaj, lMin, lPatch] = parseVersion(local)
  const [sMaj, sMin, sPatch] = parseVersion(store)
  return lMaj === sMaj && lMin === sMin && sPatch > lPatch
}

/**
 * Returns true when the store version has a higher Major or Minor than local.
 * Triggers the mandatory (non-dismissible) upgrade gate.
 * e.g. local=2.5.11 store=2.6.0  → true  (minor bump)
 *      local=2.5.11 store=3.0.0  → true  (major bump)
 *      local=2.5.11 store=2.5.12 → false (patch only → UpgradeRecommended territory)
 */
export function isMajorMinorUpgrade(local: string, store: string): boolean {
  if (!local || !store) return false
  const [lMaj, lMin] = parseVersion(local)
  const [sMaj, sMin] = parseVersion(store)
  return sMaj > lMaj || (sMaj === lMaj && sMin > lMin)
}
