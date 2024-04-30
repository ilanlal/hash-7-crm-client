import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ContactItem } from "../types/app.crm.contact";
import { auth, db } from "../firebase-config";

const CONTACTS_COLLECTION = 'contacts';
export function listAllContact(uid: string): Promise<ContactItem[]> {
    console.log('listTodoItems start');
    const itemCollectionContext = collection(db, `users`, uid, CONTACTS_COLLECTION);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listTodoItems response', response);
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    displayName: doc.data().displayName,
                    email: doc.data().email,
                    phone: doc.data().phone,
                    createdOn: doc.data().createdOn?.toDate(),
                    modifiedOn: doc.data().modifiedOn?.toDate(),
                } as ContactItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listAllContact error', err);
                reject(err);
            })
            .finally(() => {
                console.log('listAllContact finally');
            });;
    });
};

export function createContact(item: ContactItem): Promise<ContactItem> {
    console.log('createItem', item);
    const itemCollectionContext = collection(db, `users/${auth.currentUser?.uid}/${CONTACTS_COLLECTION}`);
    return new Promise((resolve, reject) => {
        addDoc(itemCollectionContext, item)
            .then(response => {
                console.log('createItem response', response);
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
    console.log('deleteItem', { docRef });

    return new Promise((resolve, reject) => {
        deleteDoc(docRef)
            .then(() => {
                console.log('deleteItem response');
                resolve(true);
            })
            .catch(err => {
                console.log('deleteItem error', err);
                reject(err);
            });
    });
}