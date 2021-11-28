import { IEmployee } from "./employees";

export interface IOffice {
    id: number;
    name: string;
    address: string;
    phoneNumber: number;
    emailAddress: string;
    capacity: number;
    colour:string
}
