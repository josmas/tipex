import type { TipexEditor } from '../Tipex.svelte';
export interface EditLinkMenuProps {
    enableLinkEdit?: boolean;
    tipex: TipexEditor;
}
declare const EditLinkMenu: import("svelte").Component<EditLinkMenuProps, {}, "enableLinkEdit">;
type EditLinkMenu = ReturnType<typeof EditLinkMenu>;
export default EditLinkMenu;
