import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { UserIdentity } from "../types/app";

export function getUserByEmail(email: string): Promise<UserIdentity | null> {
    console.log('getUserByEmail start', email);
    const itemCollectionContext = collection(db, `users`);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {                
                if (response.docs.length === 0) {
                    resolve(null);
                }
                else {
                    const _item = response.docs.map((doc) => {
                        return { ...doc.data() as UserIdentity, id: doc.id };
                    }).find((item) => item.email === email);

                    if (!_item) {
                        resolve(null);
                    }

                    else {
                        resolve(_item);
                    }
                }
            });
    });
};

export function getUser(uid: string): Promise<UserIdentity | null> {
    console.log('getUser start', uid);
    const itemCollectionContext = collection(db, `users`);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('getUser response', response);
                if (response.docs.length === 0) {
                    resolve(null);
                }
                else {
                    const _item = response.docs.map((doc) => doc.data())
                        .find((item) => item.id === uid);

                    if (!_item) {
                        resolve(null);
                    }
                    resolve(_item as UserIdentity);
                }
            });
    });
};

export function createUser(item: UserIdentity): Promise<UserIdentity> {
    const itemCollectionContext = collection(db, `users`);

    return new Promise((resolve, reject) => {
        const documentId = item.sub;

        console.log('createUser newItem', item, documentId);
        //item.id = documentId;
        addDoc(itemCollectionContext, item)
            .then((response) => {
                console.log('createItem success', response);
                resolve(item);
            });
    });
};
