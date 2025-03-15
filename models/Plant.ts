import { Attribute } from './Attribute';
import { Description } from './Descriptions';

export interface Plant {
    id: number;
    name: string;
    descriptions: Description[];
    attributes: Attribute[];
    img: string;
}