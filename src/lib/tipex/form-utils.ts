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
export function findFormContext(element: Element | null): FormContext {
	if (!element) {
		return { inForm: false, formElement: null, isSuperform: false, formLibraryDetected: null };
	}

	let current: Element | null = element;
	while (current && current !== document.body) {
		// Check for form element
		if (current.tagName === 'FORM') {
			const formElement = current as HTMLFormElement;

			// Check for Superforms indicators
			const isSuperform = !!(
				current.hasAttribute('data-superform') ||
				current.querySelector('[data-superform]') ||
				current.closest('[data-superform]') ||
				// Check for common Superforms classes/attributes
				current.className.includes('superform') ||
				current.querySelector('.superform') ||
				// Check for enhance attribute (SvelteKit form enhancement)
				current.hasAttribute('use:enhance') ||
				// Check for method attribute (often used with Superforms)
				(current.hasAttribute('method') && current.getAttribute('method') === 'POST')
			);

			// Check for other form libraries
			let formLibraryDetected: string | null = null;
			if (isSuperform) {
				formLibraryDetected = 'superforms';
			} else if (current.hasAttribute('data-form') || current.className.includes('formkit')) {
				formLibraryDetected = 'formkit';
			} else if (current.hasAttribute('data-react-hook-form')) {
				formLibraryDetected = 'react-hook-form';
			} else if (current.hasAttribute('data-felte')) {
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
		if (
			current.hasAttribute('data-form-container') ||
			current.className.includes('form-container') ||
			current.hasAttribute('data-superform') ||
			// SvelteKit form containers
			current.hasAttribute('data-sveltekit-form')
		) {
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
export function isFormCriticalEvent(eventType: string): boolean {
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
export function handleFormAwareEvent(
	event: MouseEvent,
	editorElement: Element | HTMLElement | null | undefined,
	action: () => void
): void {
	const formContext = editorElement
		? findFormContext(editorElement)
		: { inForm: false, formElement: null, isSuperform: false, formLibraryDetected: null };

	// Debug logging to help troubleshoot issues
	if (typeof window !== 'undefined' && (window as any).__TIPEX_DEBUG) {
		console.log('Tipex form-aware event:', {
			eventType: event.type,
			target: event.target,
			formContext,
			editorElement
		});
	}

	// For form contexts, use more selective event handling
	if (formContext.inForm) {
		// Always prevent default to stop unwanted form behaviors
		event.preventDefault();
		
		// For ANY form context, be very conservative about stopping propagation
		// Only stop propagation for button clicks, allow everything else to bubble
		if (event.type === 'click' && event.target instanceof HTMLButtonElement) {
			event.stopPropagation();
		}
		// Let all other events bubble up for form state management
	} else {
		// Original behavior for non-form contexts
		event.stopPropagation();
		event.preventDefault();
	}

	action();
}

/**
 * Enhanced focus management that accounts for form contexts and component boundaries
 */
export function handleFormAwareFocus(
	tipex: any,
	editorElement: Element | HTMLElement | null | undefined,
	formContext?: FormContext
): void {
	if (!tipex || !editorElement) return;

	const context = formContext || findFormContext(editorElement);

	// Check if editor already has focus
	const isEditorFocused =
		document.activeElement &&
		(editorElement === document.activeElement || editorElement.contains(document.activeElement));

	if (!isEditorFocused) {
		if (context.inForm) {
			// For ALL forms, use a gentle focus approach to avoid conflicts
			setTimeout(() => {
				// Double-check focus state after timeout to avoid conflicts
				if (!document.activeElement || !editorElement.contains(document.activeElement)) {
					tipex.chain().focus().run();
				}
			}, 0);
		} else {
			// For non-form contexts, immediate focus is fine
			tipex.chain().focus().run();
		}
	}
}

