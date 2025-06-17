import { FloatingMenu } from '@tiptap/extension-floating-menu';
export function getDefaultFloatingMenu(editLinkRef, parentElement) {
    return FloatingMenu.configure({
        pluginKey: 'floatingLinkEdit',
        element: editLinkRef,
        shouldShow: ({ editor }) => {
            return editor.isActive('link');
        },
        tippyOptions: {
            placement: 'top-start',
            zIndex: 1000, // Higher z-index to avoid conflicts with form elements
            popperOptions: {
                placement: 'top-start',
                strategy: 'fixed'
            },
            // Append to parent element if provided (for form contexts)
            appendTo: () => parentElement || document.body
        }
    });
}
