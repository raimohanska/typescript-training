// Using typeof on type level

function foo(): string { return "foo" }
type FooFunctionType = typeof foo
type FooReturnType = ReturnType<FooFunctionType>

const data = {
    foo: "hello"
}
type DataType = typeof data


// Using typeof in code

function smart(input: string | number) {
    if (typeof input === "string") {
        console.log("It's a string")
    }
}