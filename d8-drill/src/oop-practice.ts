/**
 * OOP practice — run: npx ts-node src/oop-practice.ts
 * Study guide: ../../docs/typescript-oop-complete.md
 */

// --- Level 1: Class basics ---
class BankAccount {
  constructor(private balance: number) {}

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdrawal must be positive");
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

// --- Level 2: Interface + implements (repository pattern) ---
interface Todo {
  id: string;
  title: string;
  done: boolean;
}

interface ITodoRepository {
  save(todo: Todo): void;
  findById(id: string): Todo | undefined;
  getAll(): Todo[];
}

class InMemoryTodoRepository implements ITodoRepository {
  private todos: Todo[] = [];

  save(todo: Todo): void {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index === -1) {
      this.todos.push(todo);
    } else {
      this.todos[index] = todo;
    }
  }

  findById(id: string): Todo | undefined {
    return this.todos.find((t) => t.id === id);
  }

  getAll(): Todo[] {
    return [...this.todos];
  }
}

// --- Level 3: Service + dependency injection ---
class TodoService {
  constructor(private repo: ITodoRepository) {}

  createTodo(id: string, title: string): { success: boolean; message: string } {
    if (!title.trim()) {
      return { success: false, message: "Title is required" };
    }
    if (this.repo.findById(id)) {
      return { success: false, message: "Todo already exists" };
    }
    this.repo.save({ id, title, done: false });
    return { success: true, message: "Todo created" };
  }

  toggleTodo(id: string): { success: boolean; message: string } {
    const todo = this.repo.findById(id);
    if (!todo) {
      return { success: false, message: "Todo not found" };
    }
    this.repo.save({ ...todo, done: !todo.done });
    return { success: true, message: "Todo updated" };
  }
}

// --- Level 4: Inheritance + override ---
abstract class Notifier {
  abstract send(message: string): void;

  notify(message: string): void {
    this.send(`[NOTIFY] ${message}`);
  }
}

class ConsoleNotifier extends Notifier {
  override send(message: string): void {
    console.log(message);
  }
}

// --- Level 5: Generics ---
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

// --- Demo runner ---
function main(): void {
  const account = new BankAccount(100);
  account.deposit(50);
  account.withdraw(30);
  console.log("Balance:", account.getBalance());

  const repo = new InMemoryTodoRepository();
  const todos = new TodoService(repo);
  console.log(todos.createTodo("1", "Learn OOP"));
  console.log(todos.toggleTodo("1"));
  console.log("All todos:", repo.getAll());

  const notifier = new ConsoleNotifier();
  notifier.notify("OOP practice complete");

  const stack = new Stack<string>();
  stack.push("a");
  stack.push("b");
  console.log("Stack pop:", stack.pop());
}

main();
