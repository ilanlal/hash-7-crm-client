import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ContactItem } from "../types/app.crm.contact";
import { auth, db } from "../firebase-config";

const CONTACTS_COLLECTION = 'contacts';
export function listAllContact(uid: string): Promise<ContactItem[]> {
    const itemCollectionContext = collection(db, `users`, uid, CONTACTS_COLLECTION);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listAllContact success');
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    createdOn: doc.data().createdOn.toDate(),
                    modifiedOn: doc.data().modifiedOn.toDate(),
                    id: doc.id
                } as ContactItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listAllContact error', err);
                reject(err);
            });
    });
};

export function createContact(item: ContactItem): Promise<ContactItem> {
    const itemCollectionContext = collection(db, `users/${auth.currentUser?.uid}/${CONTACTS_COLLECTION}`);
    return new Promise((resolve, reject) => {
        addDoc(itemCollectionContext, item)
            .then(response => {
                console.log('createItem response success');
                resolve({ ...item, id: response.id });
            })
            .catch(err => {
                console.log('createItem error', err);
                reject(err);
            });
    });
};

export function deleteContact(uid: string, id: string): Promise<boolean> {
    const docRef = doc(db, `users/${uid}/${CONTACTS_COLLECTION}/${id}`);
    console.log('deleteItem', { id });

    return new Promise((resolve, reject) => {
        deleteDoc(docRef)
            .then(() => {
                console.log('deleteItem done');
                resolve(true);
            })
            .catch(err => {
                console.log('deleteItem error', err);
                reject(err);
            });
    });
}