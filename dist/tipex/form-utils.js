/**
 * Enhanced form utilities for Tipex components to handle complex nested form scenarios
 * and integration with form libraries like Superforms
 */
/**
 * Enhanced form detection - traverses DOM tree to find form ancestors
 * Supports nested components and various form libraries
 */
export function findFormContext(element) {
    if (!element) {
        return { inForm: false, formElement: null, isSuperform: false, formLibraryDetected: null };
    }
    let current = element;
    while (current && current !== document.body) {
        // Check for form element
        if (current.tagName === 'FORM') {
            const formElement = current;
            // Check for Superforms indicators
            const isSuperform = !!(current.hasAttribute('data-superform') ||
                current.querySelector('[data-superform]') ||
                current.closest('[data-superform]') ||
                // Check for common Superforms classes/attributes
                current.className.includes('superform') ||
                current.querySelector('.superform') ||
                // Check for enhance attribute (SvelteKit form enhancement)
                current.hasAttribute('use:enhance') ||
                // Check for method attribute (often used with Superforms)
                (current.hasAttribute('method') && current.getAttribute('method') === 'POST'));
            // Check for other form libraries
            let formLibraryDetected = null;
            if (isSuperform) {
                formLibraryDetected = 'superforms';
            }
            else if (current.hasAttribute('data-form') || current.className.includes('formkit')) {
                formLibraryDetected = 'formkit';
            }
            else if (current.hasAttribute('data-react-hook-form')) {
                formLibraryDetected = 'react-hook-form';
            }
            else if (current.hasAttribute('data-felte')) {
                formLibraryDetected = 'felte';
            }
            return {
                inForm: true,
                formElement,
                isSuperform,
                formLibraryDetected
            };
        }
        // Check for form-like containers that might wrap forms
        if (current.hasAttribute('data-form-container') ||
            current.className.includes('form-container') ||
            current.hasAttribute('data-superform') ||
            // SvelteKit form containers
            current.hasAttribute('data-sveltekit-form')) {
            // Continue traversing - might find actual form element
        }
        current = current.parentElement;
    }
    return { inForm: false, formElement: null, isSuperform: false, formLibraryDetected: null };
}
/**
 * Determines if an event type is critical for form functionality
 * These events should not have their propagation stopped
 */
export function isFormCriticalEvent(eventType) {
    return [
        'submit',
        'change',
        'input',
        'focus',
        'blur',
        'reset',
        'invalid',
        'select',
        // Form validation events
        'error',
        'load'
    ].includes(eventType);
}
/**
 * Enhanced event handling that respects form context and library requirements
 */
export function handleFormAwareEvent(event, editorElement, action) {
    const formContext = editorElement ? findFormContext(editorElement) :
        { inForm: false, formElement: null, isSuperform: false, formLibraryDetected: null };
    // For form contexts, use more selective event handling
    if (formContext.inForm) {
        // Always prevent default to stop unwanted form behaviors
        event.preventDefault();
        // Only stop propagation if it's not a form-critical event
        const isFormCritical = isFormCriticalEvent(event.type);
        if (!isFormCritical) {
            // For Superforms and other libraries, be more careful about stopping propagation
            if (formContext.isSuperform || formContext.formLibraryDetected) {
                // Only stop propagation for click events on buttons
                if (event.type === 'click' && event.target instanceof HTMLButtonElement) {
                    event.stopPropagation();
                }
                // Allow other events to bubble for form state management
            }
            else {
                // For vanilla forms, safe to stop propagation
                event.stopPropagation();
            }
        }
    }
    else {
        // Original behavior for non-form contexts
        event.stopPropagation();
        event.preventDefault();
    }
    action();
}
/**
 * Enhanced focus management that accounts for form contexts and component boundaries
 */
export function handleFormAwareFocus(tipex, editorElement, formContext) {
    if (!tipex || !editorElement)
        return;
    const context = formContext || findFormContext(editorElement);
    // Check if editor already has focus
    const isEditorFocused = document.activeElement &&
        (editorElement === document.activeElement || editorElement.contains(document.activeElement));
    if (!isEditorFocused) {
        if (context.inForm && context.isSuperform) {
            // For Superforms, use a more gentle focus approach to avoid conflicts
            setTimeout(() => {
                // Double-check focus state after timeout to avoid conflicts
                if (!document.activeElement || !editorElement.contains(document.activeElement)) {
                    tipex.chain().focus().run();
                }
            }, 0);
        }
        else if (context.inForm) {
            // For other form libraries, use a slight delay to avoid timing issues
            requestAnimationFrame(() => {
                tipex.chain().focus().run();
            });
        }
        else {
            // For non-form contexts, immediate focus is fine
            tipex.chain().focus().run();
        }
    }
}
