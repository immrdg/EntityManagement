export class BooleanClass {
    value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    and(other: boolean): boolean {
        return this.value && other;
    }

    or(other: boolean): boolean {
        return this.value || other;
    }
}
