// models/UserModel.ts

export class UserModel {
    private phoneNumber: string;
    private selectedCode: string;
    private email: string;

    constructor(phoneNumber: string = '', selectedCode: string = '+90', email: string = '') {
        this.phoneNumber = phoneNumber;
        this.selectedCode = selectedCode;
        this.email = email;
    }

    // Getter and Setter for phone number
    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '').slice(0, 10); // Ensuring only digits and length constraint
    }

    // Getter and Setter for selected code
    public getSelectedCode(): string {
        return this.selectedCode;
    }

    public setSelectedCode(selectedCode: string): void {
        this.selectedCode = selectedCode;
    }

    // Getter and Setter for email
    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    // Validation for phone number
    public isValidPhone(): boolean {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(this.phoneNumber);
    }

    // Validation for email
    public isValidEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
}
