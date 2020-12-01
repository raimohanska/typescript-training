export class Horse {
    readonly name: string;
    constructor(name: string) {
        this.name = name
    }
    greet() {
        return this.name
    }
}

new Horse("hepo").name