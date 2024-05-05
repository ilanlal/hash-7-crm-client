import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { CustomerItem } from "../types/app.crm.customers";

const CUSTOMERS_COLLECTION = 'customers';
export function listAllCustomers(uid: string): Promise<CustomerItem[]> {
    if (uid === '' || uid === null || uid === undefined) {
        console.log('listAllCustomers empty uid');
        return Promise.resolve([]);
    }
    const itemCollectionContext = collection(db, `users`, uid, CUSTOMERS_COLLECTION);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listAllCustomers success');
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    createdOn: doc.data().createdOn.toDate(),
                    modifiedOn: doc.data().modifiedOn.toDate(),
                    id: doc.id
                } as CustomerItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listAllCustomers error', err);
                reject(err);
            });
    });
};

export function createCustomer(item: CustomerItem): Promise<CustomerItem> {
    const itemCollectionContext = collection(db, `users/${auth.currentUser?.uid}/${CUSTOMERS_COLLECTION}`);
    return new Promise((resolve, reject) => {
        addDoc(itemCollectionContext, item)
            .then(response => {
                console.log('createItem success');
                resolve({ ...item, id: response.id });
            })
            .catch(err => {
                console.log('createItem error', err);
                reject(err);
            });
    });
};

export function deleteCustomer(uid: string, id: string): Promise<boolean> {
    const docRef = doc(db, `users/${uid}/${CUSTOMERS_COLLECTION}/${id}`);

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