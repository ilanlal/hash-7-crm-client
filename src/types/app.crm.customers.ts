export interface CustomerItem {
    id?: string;
    title: string;
    description?: string | null;
    createdOn?: Date;
    modifiedOn?: Date;
    isNew?: boolean;
};