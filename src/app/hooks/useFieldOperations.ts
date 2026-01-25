import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { ClientData } from '../types/brandGuidelines';
import { toast } from 'sonner';

interface UseFieldOperationsProps {
  clientId: Id<'clients'>;
  fullData: ClientData;
  readOnly?: boolean;
}

interface UseFieldOperationsReturn {
  /** Save a single field at the given path */
  saveField: (path: string[], value: unknown) => Promise<void>;
  /** Add an item to an array at the given path */
  addToArray: (path: string[], newItem: unknown) => Promise<void>;
  /** Remove an item from an array at the given path by index */
  removeFromArray: (path: string[], index: number) => Promise<void>;
  /** Save a simple array item (string) at the given path and index */
  saveArrayItem: (path: string[], index: number, value: string) => Promise<void>;
  /** Save a specific field within an array item */
  saveArrayItemField: (path: string[], index: number, field: string, value: unknown) => Promise<void>;
}

/**
 * Custom hook that provides field manipulation operations for brand guidelines data.
 * Handles deep cloning, path traversal, and Convex mutations.
 *
 * @example
 * const { saveField, addToArray, removeFromArray } = useFieldOperations({
 *   clientId,
 *   fullData,
 *   readOnly: false
 * });
 *
 * // Save a nested field
 * saveField(['foundations', 'brand_identity', 'mission_statement'], 'New mission');
 *
 * // Add to array
 * addToArray(['personality_and_tone', 'brand_personality_traits'], 'Innovative');
 */
export function useFieldOperations({
  clientId,
  fullData,
  readOnly = false,
}: UseFieldOperationsProps): UseFieldOperationsReturn {
  const updateClient = useMutation(api.clients.update);

  /**
   * Deep clone the data and navigate to the parent of the target path.
   * Returns the cloned data and the parent object.
   */
  const prepareUpdate = useCallback(
    (path: string[]): { newData: ClientData; parent: Record<string, unknown>; finalKey: string } => {
      const newData = JSON.parse(JSON.stringify(fullData)) as ClientData;
      let parent: Record<string, unknown> = newData as unknown as Record<string, unknown>;

      // Navigate to the parent object, creating nested objects as needed
      for (let i = 0; i < path.length - 1; i++) {
        if (!parent[path[i]]) {
          parent[path[i]] = {};
        }
        parent = parent[path[i]] as Record<string, unknown>;
      }

      return { newData, parent, finalKey: path[path.length - 1] };
    },
    [fullData]
  );

  const saveField = useCallback(
    async (path: string[], value: unknown): Promise<void> => {
      if (readOnly) return;

      try {
        const { newData, parent, finalKey } = prepareUpdate(path);
        parent[finalKey] = value;
        await updateClient({ id: clientId, data: newData });
      } catch (error) {
        console.error('Failed to save field:', error);
        toast.error('Failed to save changes');
      }
    },
    [clientId, prepareUpdate, updateClient, readOnly]
  );

  const addToArray = useCallback(
    async (path: string[], newItem: unknown): Promise<void> => {
      if (readOnly) return;

      try {
        const { newData, parent, finalKey } = prepareUpdate(path);
        if (!parent[finalKey]) {
          parent[finalKey] = [];
        }
        (parent[finalKey] as unknown[]).push(newItem);
        await updateClient({ id: clientId, data: newData });
      } catch (error) {
        console.error('Failed to add item:', error);
        toast.error('Failed to add item');
      }
    },
    [clientId, prepareUpdate, updateClient, readOnly]
  );

  const removeFromArray = useCallback(
    async (path: string[], index: number): Promise<void> => {
      if (readOnly) return;

      try {
        const { newData, parent, finalKey } = prepareUpdate(path);
        const array = parent[finalKey] as unknown[];
        if (array && Array.isArray(array)) {
          array.splice(index, 1);
          await updateClient({ id: clientId, data: newData });
        }
      } catch (error) {
        console.error('Failed to remove item:', error);
        toast.error('Failed to remove item');
      }
    },
    [clientId, prepareUpdate, updateClient, readOnly]
  );

  const saveArrayItem = useCallback(
    async (path: string[], index: number, value: string): Promise<void> => {
      if (readOnly) return;

      try {
        const { newData, parent, finalKey } = prepareUpdate(path);
        const array = parent[finalKey] as string[];
        if (array && Array.isArray(array)) {
          array[index] = value;
          await updateClient({ id: clientId, data: newData });
        }
      } catch (error) {
        console.error('Failed to save array item:', error);
        toast.error('Failed to save changes');
      }
    },
    [clientId, prepareUpdate, updateClient, readOnly]
  );

  const saveArrayItemField = useCallback(
    async (path: string[], index: number, field: string, value: unknown): Promise<void> => {
      if (readOnly) return;

      try {
        const { newData, parent, finalKey } = prepareUpdate(path);
        const array = parent[finalKey] as Record<string, unknown>[];
        if (array && Array.isArray(array) && array[index]) {
          array[index][field] = value;
          await updateClient({ id: clientId, data: newData });
        }
      } catch (error) {
        console.error('Failed to save array item field:', error);
        toast.error('Failed to save changes');
      }
    },
    [clientId, prepareUpdate, updateClient, readOnly]
  );

  return {
    saveField,
    addToArray,
    removeFromArray,
    saveArrayItem,
    saveArrayItemField,
  };
}
