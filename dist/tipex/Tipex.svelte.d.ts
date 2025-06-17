import type { Snippet } from 'svelte';
import type { AnyExtension, EditorEvents } from '@tiptap/core';
export type TipexEditor = InstanceType<typeof Editor> | undefined;
export type HasEditorSnippet = Snippet<[TipexEditor]>;
export interface Boolish {
    focal?: boolean;
    floating?: boolean;
    '!focal'?: never;
    '!floating'?: never;
}
export interface NonBoolish {
    '!focal'?: true;
    '!floating'?: true;
    focal?: never;
    floating?: never;
}
export interface WithControlsOn {
    controls?: true;
    '!controls'?: never;
    controlComponent?: never;
    utilities?: HasEditorSnippet;
}
export interface WithControlsOff {
    controls?: false;
    '!controls'?: never;
    utilities?: never;
    controlComponent?: HasEditorSnippet;
}
export interface WithControlsNot {
    '!controls': true;
    controls?: never;
    utilities?: never;
    controlComponent?: never;
}
export type WithControlsX = WithControlsOn | WithControlsOff | WithControlsNot;
export type TipexProps = {
    class?: string;
    /**
     * Context ID to be used for the editor.
     */
    ctxId?: `${string}_tipex`;
    extensions?: AnyExtension[];
    /**
     * The editor's head section.
     */
    foot?: HasEditorSnippet;
    /**
     * The editor's foot section.
     */
    head?: HasEditorSnippet;
    body?: string;
    oncreate?: (props: EditorEvents['create']) => void;
    ondestroy?: (props: EditorEvents['destroy']) => void;
    onupdate?: (props: EditorEvents['update']) => void;
    style?: string;
    /**
     * The editor instance.
     */
    tipex?: TipexEditor;
    /**
     * Whether the editor should is focused, bind.
     */
    focused?: boolean;
    /**
     * Whether the editor should have autofocus on mount.
     */
    autofocus?: boolean;
} & WithControlsX & (Boolish | NonBoolish);
import { Editor } from '@tiptap/core';
declare const Tipex: import("svelte").Component<TipexProps, {}, "extensions" | "tipex" | "focused">;
type Tipex = ReturnType<typeof Tipex>;
export default Tipex;
