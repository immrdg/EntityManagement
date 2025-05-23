export class StringClass {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    // String method to get the length of the string
    length(): number {
        return this.value.length;
    }

    // String method to check equality
    equals(other: StringClass): boolean {
        return this.value === other.value;
    }

    // String method to concatenate two strings
    concat(other: string): string {
        return this.value + other;
    }

    // String method to extract a substring
    substring(start: number, end: number): string {
        return this.value.slice(start, end);
    }
}
