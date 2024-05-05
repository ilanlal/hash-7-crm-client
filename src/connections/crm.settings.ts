import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { UserSettings } from "../types/app.crm.setting";

export function getUserSetting(uid: string): Promise<UserSettings | null> {
    if (uid === '' || uid === null || uid === undefined) {
        console.log('listAllLeads empty uid');
        return Promise.resolve(null);
    }
    
    const docRef = doc(db, `users/${uid}`);

    return new Promise((resolve, reject) => {
        getDoc(docRef)
            .then(response => {
                console.log('listAllLeads success');
                const items = {
                    ...response.data(),
                    id: response.id
                };
                resolve(items as UserSettings);
            })
            .catch(err => {
                console.log('listAllLeads error', err);
                reject(err);
            });
    });
};

export function updateUserSetting(item: UserSettings): Promise<UserSettings | null> {
    if(!item?.id) return Promise.resolve(null);

    const docRef = doc(db, `users/${item?.id}`);
    return new Promise((resolve, reject) => {
        updateDoc(docRef, { ...item as any, modifiedOn: new Date() })
            .then(response => {
                console.log('createItem success');
                resolve({ ...item });
            })
            .catch(err => {
                console.log('createItem error', err);
                reject(err);
            });
    });
};
