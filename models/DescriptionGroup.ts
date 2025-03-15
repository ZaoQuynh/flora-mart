import { Description } from './Descriptions';

export interface DescriptionGroup {
    id: number;
    name: string;
    icon: string;
    descriptions: Description[];
}