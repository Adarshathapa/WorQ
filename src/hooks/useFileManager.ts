import { useState, useEffect, useCallback } from 'react';
import { set, get, del, keys, clear } from 'idb-keyval';
import { FileItem } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper to convert base64 to blob
const base64ToBlob = (base64: string): Promise<Blob> => {
  return fetch(base64).then(res => res.blob());
};

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  
  // Local persistence function
  const loadLocalFiles = useCallback(async () => {
    try {
      const allKeys = await keys();
      const metaKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('meta_'));
      
      const fileMetaList: FileItem[] = [];
      for (const k of metaKeys) {
        const meta = await get<FileItem>(k);
        if (meta) {
          fileMetaList.push(meta);
        }
      }
      
      fileMetaList.sort((a, b) => b.date - a.date);
      setFiles(fileMetaList);
    } catch (e) {
      console.error('Failed to load local files:', e);
    }
  }, []);

  useEffect(() => {
    let unsub: () => void = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      unsub(); // Unsubscribe previous listener
      
      if (user) {
        const filesRef = collection(db, 'users', user.uid, 'files');
        unsub = onSnapshot(filesRef, async (snapshot) => {
          const cloudFiles: FileItem[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            cloudFiles.push({
              id: data.id,
              name: data.name,
              size: data.size,
              type: data.type,
              date: data.date
            });
          }, (error: unknown) => handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/files`));
          
          // Basic merge strategy: prefer cloud files, overwrite local config. 
          // Realistically, we should do a 2-way sync, but simplest is cloud overwrites local if authed to avoid conflicts.
          
          cloudFiles.sort((a, b) => b.date - a.date);
          setFiles(cloudFiles);
        });
      } else {
        loadLocalFiles();
      }
    });

    return () => {
      unsubscribeAuth();
      unsub();
    };
  }, [loadLocalFiles]);

  const saveFile = async (meta: Omit<FileItem, 'id' | 'date'>, blob: Blob) => {
    try {
      const id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
      const newMeta: FileItem = {
        ...meta,
        id,
        date: Date.now()
      };
      
      await set(`meta_${id}`, newMeta);
      await set(`file_${id}`, blob);
      
      const user = auth.currentUser;
      if (user) {
        let fileDataString = '';
        // Only backup file to firestore if it's < 800 KB to be safe within 1 MB doc size limit.
        if (blob.size < 800 * 1024) {
          fileDataString = await blobToBase64(blob);
        }
        
        const fileRef = doc(db, 'users', user.uid, 'files', id);
        await setDoc(fileRef, {
          id: id,
          uid: user.uid,
          name: newMeta.name,
          size: newMeta.size,
          type: newMeta.type,
          date: newMeta.date,
          fileData: fileDataString,
          updatedAt: Date.now()
        }).catch((err) => handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/files/${id}`));
      } else {
         setFiles(prev => {
            const newList = [newMeta, ...prev];
            newList.sort((a, b) => b.date - a.date);
            return newList;
         });
      }

      return id;
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  const getFileData = async (id: string): Promise<Blob | undefined> => {
    try {
      // Check local first
      const localBlob = await get<Blob>(`file_${id}`);
      if (localBlob) return localBlob;
      
      // If not local but authed, check cloud
      if (auth.currentUser) {
         const fileRef = doc(db, 'users', auth.currentUser.uid, 'files', id);
         const fileDoc = await getDoc(fileRef);
         if (fileDoc.exists()) {
            const data = fileDoc.data();
            if (data.fileData) {
               const downloadedBlob = await base64ToBlob(data.fileData);
               // Cache locally for next time
               await set(`meta_${id}`, { id: data.id, name: data.name, size: data.size, type: data.type, date: data.date });
               await set(`file_${id}`, downloadedBlob);
               return downloadedBlob;
            }
         }
      }
    } catch (e) {
      console.error('Failed to get file data:', e);
      if (e && auth.currentUser) {
          handleFirestoreError(e, OperationType.GET, `users/${auth.currentUser.uid}/files/${id}`);
      }
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await del(`meta_${id}`);
      await del(`file_${id}`);
      
      const user = auth.currentUser;
      if (user) {
         const fileRef = doc(db, 'users', user.uid, 'files', id);
         await deleteDoc(fileRef).catch(err => handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/files/${id}`));
      } else {
         setFiles(prev => prev.filter(f => f.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete file:', e);
    }
  };

  const clearAllFiles = async () => {
    try {
      await clear();
      
      const user = auth.currentUser;
      if (user) {
        // Warning: this doesn't clear cloud files since batch delete can be complex,
        // ideally we would query all and delete, but here let's just clear local for now
        // or loop and delete
        const allLocalFiles = files; // files is local + cloud state
        for (const file of allLocalFiles) {
           const fileRef = doc(db, 'users', user.uid, 'files', file.id);
           await deleteDoc(fileRef).catch(err => console.error(err));
        }
      } else {
         setFiles([]);
      }
    } catch (e) {
      console.error('Failed to clear files:', e);
    }
  };

  return { files, saveFile, getFileData, deleteFile, clearAllFiles, loadFiles: loadLocalFiles };
};
