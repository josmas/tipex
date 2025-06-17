import { type Snippet } from 'svelte';
import type { TipexEditor } from './Tipex.svelte';
export interface UtilityProps {
    children?: Snippet;
    tipex: TipexEditor;
}
declare const Utility: import("svelte").Component<UtilityProps, {}, "">;
type Utility = ReturnType<typeof Utility>;
export default Utility;
