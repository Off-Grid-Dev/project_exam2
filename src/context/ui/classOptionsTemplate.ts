import type { Breakpoint } from './BreakpointContext';

export type ClassOptions = {
  desktopStyles: string;
  tabletStyles: string;
  mobileStyles: string;
};

/**
 * Create a fresh ClassOptions object for a component (fills missing props with '')
 */
export const createClassOptions = (
  overrides: Partial<ClassOptions> = {},
): ClassOptions => ({
  desktopStyles: overrides.desktopStyles ?? '',
  tabletStyles: overrides.tabletStyles ?? '',
  mobileStyles: overrides.mobileStyles ?? '',
});

/**
 * Return the appropriate class string for a breakpoint.
 * Uses a typed lookup so callers don't need to cast to `any`.
 */
export const getClassFor = (bp: Breakpoint, opts: ClassOptions): string =>
  opts[`${bp}Styles` as keyof ClassOptions] ?? '';

/**
 * Compose class fragments, ignoring falsy values.
 */
export const composeClasses = (
  ...parts: Array<string | false | undefined | null>
) => parts.filter(Boolean).join(' ');

/**
 * Small slot map utility types/helpers for components with multiple responsive slots.
 */
export type SlotMap<T extends string> = Record<T, ClassOptions>;

export function getClassForSlot<T extends string>(
  bp: Breakpoint,
  map: SlotMap<T>,
  slot: T,
) {
  return getClassFor(bp, map[slot]);
}

// keep a default template export compatible with prior imports (empty options)
const classOptionsTemplate = createClassOptions();
export default classOptionsTemplate;
