import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LoanApplication {
    status: string;
    trackingNumber: bigint;
    loanOfferId: bigint;
    profile: Profile;
}
export interface Profile {
    dob: string;
    pan: string;
    name: string;
    email: string;
    address: string;
    mobile: string;
    pincode: string;
}
export interface LoanOffer {
    id: bigint;
    loanDurationMonths: bigint;
    loanAmount: bigint;
    name: string;
    description: string;
    interestRate: number;
}
export interface backendInterface {
    getAllLoanApplications(): Promise<Array<LoanApplication>>;
    getApplicationStatus(trackingNumber: bigint): Promise<string>;
    getLoanApplication(trackingNumber: bigint): Promise<LoanApplication>;
    getLoanOffers(): Promise<Array<LoanOffer>>;
    submitLoanApplication(profile: Profile, loanOfferId: bigint): Promise<bigint>;
}
