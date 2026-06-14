// Module-level tap state — lives outside React so it survives component remounts
// (needed on Android where navigation can unmount/remount the Header).
export const tapState = {
  count: 0,
  timer: null as ReturnType<typeof setTimeout> | null,
}
