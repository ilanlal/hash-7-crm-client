import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { LeadItem } from "../types/app.crm.leads";

const LEAD_COLLECTION = 'leads';
export function listAllLeads(uid: string): Promise<LeadItem[]> {
    if (uid === '' || uid === null || uid === undefined) {
        console.log('listAllLeads empty uid');
        return Promise.resolve([]);
    }
    const itemCollectionContext = collection(db, `users`, uid, LEAD_COLLECTION);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listAllLeads success');
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                } as LeadItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listAllLeads error', err);
                reject(err);
            });
    });
};

export function createLead(item: LeadItem): Promise<LeadItem> {
    const itemCollectionContext = collection(db, `users/${auth.currentUser?.uid}/${LEAD_COLLECTION}`);
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

export function deleteLead(uid: string, id: string): Promise<boolean> {
    const docRef = doc(db, `users/${uid}/${LEAD_COLLECTION}/${id}`);

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