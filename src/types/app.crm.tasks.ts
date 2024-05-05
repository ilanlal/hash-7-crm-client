import { ContactItem } from "./app.crm.contact";

export enum TimePeriod {
    Today = 'Today',
    Tomorrow = 'Tomorrow',
    ThisWeek = 'This Week',
    NextWeek = 'Next Week',
    ThisMonth = 'This Month',
    NextMonth = 'Next Month',
    Undefined = 'Undefined'
}

export interface TodoItem {
    id?: string;
    title: string;
    timePeriod?: TimePeriod;
    description?: string | null;
    dueDate?: Date | null;
    completed: boolean | false;
    createdOn?: Date;
    modifiedOn?: Date;
    isNew?: boolean;
    Contact?: ContactItem;
};