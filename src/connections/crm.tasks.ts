import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { TodoItem } from "../types/app.crm.tasks";
import { auth, db } from "../firebase-config";

export function listAllTasks(uid: string): Promise<TodoItem[]> {
    if (uid === '' || uid === null || uid === undefined) {
        console.log('listAllTasks empty uid');
        return Promise.resolve([]);
    }
    const itemCollectionContext = collection(db, `users`, uid, `todos`);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listAllTasks success');
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    dueDate: doc.data().dueDate ? doc.data().dueDate?.toDate() : null,
                } as TodoItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listAllTasks error', err);
                reject(err);
            });
    });
};

export function createTask(item: TodoItem): Promise<TodoItem> {
    const itemCollectionContext = collection(db, `users/${auth.currentUser?.uid}/todos`);
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

export function deleteTask(uid: string, id: string): Promise<boolean> {
    const docRef = doc(db, `users/${uid}/todos/${id}`);

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