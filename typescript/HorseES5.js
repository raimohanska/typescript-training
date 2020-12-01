function Horse(name) {
    this.name = name
}

Horse.prototype = {
    greet: function () {
        return this.name
    }
}

console.log(new Horse("Bella").name);