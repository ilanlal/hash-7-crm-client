import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { TimePeriod, TodoItem } from "../types/app.crm.todo";
import { auth, db } from "../firebase-config";

export function listAll(uid: string): Promise<TodoItem[]> {
    const itemCollectionContext = collection(db, `users`, uid, `todos`);

    return new Promise((resolve, reject) => {
        getDocs(itemCollectionContext)
            .then(response => {
                console.log('listTodoItems success');
                const items = response.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    dueDate: doc.data().dueDate ? doc.data().dueDate?.toDate() : null,
                    completed: doc.data().completed,
                    createdOn: doc.data().createdOn?.toDate(),
                    modifiedOn: doc.data().modifiedOn?.toDate(),
                    timePeriod: doc.data().timePeriod ? TimePeriod[doc.data().timePeriod as keyof typeof TimePeriod] : null
                } as TodoItem));
                resolve(items);
            })
            .catch(err => {
                console.log('listTodoItems error', err);
                reject(err);
            });
    });
};

export function createItem(item: TodoItem): Promise<TodoItem> {
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

export function deleteItem(uid: string, id: string): Promise<boolean> {
    const docRef = doc(db, `users/${uid}/todos/${id}`);
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