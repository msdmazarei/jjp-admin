import { BaseModel } from "./model.base";

export interface IPrice extends BaseModel {
    book_id:string;
    price: number; // string
}  