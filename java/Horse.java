public class Horse {
    public final String name;
    public Horse(String name) {
        this.name = name;
    }
    public String greet() {
        return "Hello I'm " + this.name;
    }
}