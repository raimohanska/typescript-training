export class Horse {
    constructor(name) {
        this.name = name;
    }
    greet() {
        return this.name;
    }
}
new Horse("hepo").name;
