import { Attribute } from "./Attribute";

export interface AttributeGroup {
    id: number;
    name: string;
    icon: string;
    attributes: Attribute[];
}