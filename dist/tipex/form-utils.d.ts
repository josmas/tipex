/**
 * Enhanced form utilities for Tipex components to handle complex nested form scenarios
 * and integration with form libraries like Superforms
 */
export interface FormContext {
    inForm: boolean;
    formElement: HTMLFormElement | null;
    isSuperform: boolean;
    formLibraryDetected: string | null;
}
/**
 * Enhanced form detection - traverses DOM tree to find form ancestors
 * Supports nested components and various form libraries
 */
export declare function findFormContext(element: Element | null): FormContext;
/**
 * Determines if an event type is critical for form functionality
 * These events should not have their propagation stopped
 */
export declare function isFormCriticalEvent(eventType: string): boolean;
/**
 * Enhanced event handling that respects form context and library requirements
 */
export declare function handleFormAwareEvent(event: MouseEvent, editorElement: Element | HTMLElement | null | undefined, action: () => void): void;
/**
 * Enhanced focus management that accounts for form contexts and component boundaries
 */
export declare function handleFormAwareFocus(tipex: any, editorElement: Element | HTMLElement | null | undefined, formContext?: FormContext): void;
