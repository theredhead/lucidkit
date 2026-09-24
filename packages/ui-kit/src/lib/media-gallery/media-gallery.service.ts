import { computed, Injectable, signal } from "@angular/core";

import type { MediaGalleryItem } from "./media-gallery.types";

/** Coordinates registered media collections and fullscreen navigation state. */
@Injectable({ providedIn: "root" })
export class MediaGalleryService {
    private readonly registry = new Map<string, MediaGalleryItem>();
    private readonly revision = signal(0);
    private readonly activeId = signal<string | null>(null);

    /** Whether the fullscreen gallery is open. */
    public readonly isOpen = computed(() => this.activeId() !== null);

    /** The currently displayed item, or `null` when closed. */
    public readonly activeItem = computed(() => {
        const id = this.activeId();
        this.revision();
        return id ? (this.registry.get(id) ?? null) : null;
    });

    /** The active item's zero-based position in its collection. */
    public readonly activeIndex = computed(() => {
        const active = this.activeItem();
        if (!active) return -1;
        return this.items(active.collection).findIndex((item) => item.id === active.id);
    });

    /** Register an item and return a cleanup function for its host directive. */
    public register(item: MediaGalleryItem): () => void {
        this.registry.set(item.id, item);
        this.revision.update((value) => value + 1);

        return () => {
            const wasActive = this.activeId() === item.id;
            this.registry.delete(item.id);
            this.revision.update((value) => value + 1);
            if (wasActive) this.close();
        };
    }

    /** Return the current ordered items in a collection. */
    public items(collection: string): readonly MediaGalleryItem[] {
        this.revision();
        return [...this.registry.values()].filter(
            (item) => item.collection === collection,
        );
    }

    /** Open the collection containing an item. */
    public open(id: string): void {
        if (this.registry.has(id)) this.activeId.set(id);
    }

    /** Close the fullscreen gallery. */
    public close(): void {
        this.activeId.set(null);
    }

    /** Move to the next item without wrapping. */
    public next(): void {
        const active = this.activeItem();
        if (!active) return;
        const collection = this.items(active.collection);
        const next = collection[this.activeIndex() + 1];
        if (next) this.activeId.set(next.id);
    }

    /** Move to the previous item without wrapping. */
    public previous(): void {
        const active = this.activeItem();
        if (!active) return;
        const previous = this.items(active.collection)[this.activeIndex() - 1];
        if (previous) this.activeId.set(previous.id);
    }
}
