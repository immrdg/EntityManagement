declare global {
    interface String {
        equals(str: string): boolean;
        concat(str: string): string;
        substring(start: number, end: number): string;
        lengthCustom(): number;  // Custom length method
    }
}

// Adding the methods to the String prototype
String.prototype.equals = function (str: string): boolean {
    console.log('this:', this, 'str:', str);
    console.log('this:', typeof this, 'str:', typeof str);
    return this.toString() === str.toString();
};

String.prototype.concat = function (str: string): string {
    return this.toString() + str;
};

String.prototype.substring = function (start: number, end: number): string {
    return this.slice(start, end);
};

String.prototype.lengthCustom = function (): number {
    return this.toString().length;
};
