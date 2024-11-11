// models/UserModel.ts

export class UserModel {
    private phoneNumber: string;
    private selectedCode: string;
    private email: string;
    private name: string;
    private surname: string;

    private static instance: UserModel;

    private constructor(
        phoneNumber: string = '',
        selectedCode: string = '+90',
        email: string = '',
        name: string = '',
        surname: string = ''
    ) {
        this.phoneNumber = phoneNumber;
        this.selectedCode = selectedCode;
        this.email = email;
        this.name = name;
        this.surname = surname;
    }

    // Singleton pattern to ensure only one instance exists
    public static getInstance(): UserModel {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }

    // Getter and Setter for phoneNumber
    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string): void {
        // Remove any non-digit characters and limit to 15 digits
        this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '').slice(0, 15);
    }

    // Getter and Setter for selectedCode
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

    // Getter and Setter for name
    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    // Getter and Setter for surname
    public getSurname(): string {
        return this.surname;
    }

    public setSurname(surname: string): void {
        this.surname = surname;
    }

    // Getter for full name
    public getFullName(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    // Validation method for phone number
    public isValidPhone(): boolean {
        // Validates that the phone number consists of 10 to 15 digits
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(this.phoneNumber);
    }

    // Validation method for email
    public isValidEmail(): boolean {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    // Additional validation methods can be added as needed
}
