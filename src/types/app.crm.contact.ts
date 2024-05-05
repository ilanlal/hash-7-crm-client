import { TodoItem } from "./app.crm.tasks";

export interface ContactItem {
    id: string;
    displayName: string;
    email?: string;
    phone?: string;
    todos?: TodoItem[];
    isNew?: boolean;
    createdOn?: Date;
    modifiedOn?: Date;
};