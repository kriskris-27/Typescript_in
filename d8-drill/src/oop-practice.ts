/**
 * OOP Practice — matches docs/typescript-oop-complete.md
 *
 * How to use:
 *   1. Read one lesson in the guide
 *   2. Find the matching section below
 *   3. Change code, break things, fix them
 *   4. Run: npx ts-node src/oop-practice.ts
 */

// =============================================================================
// LESSON 1 — Class basics (BankAccount)
// =============================================================================

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

// =============================================================================
// LESSONS 3–6 — Interface, implements, service, dependency injection
// (Same pattern as user.app.ts)
// =============================================================================

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
  private todos: Todo[] = []; // Lesson 2: private = encapsulation

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

class TodoService {
  constructor(private repo: ITodoRepository) {} // Lesson 6: injection

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

// =============================================================================
// LESSON 10 — Inheritance (optional, Part 3)
// =============================================================================

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

// =============================================================================
// LESSON 13 — Generics (optional, Part 3)
// =============================================================================

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

// =============================================================================
// Run all demos
// =============================================================================

function main(): void {
  console.log("--- Lesson 1: BankAccount ---");
  const account = new BankAccount(100);
  account.deposit(50);
  account.withdraw(30);
  console.log("Balance:", account.getBalance());

  console.log("\n--- Lessons 3–6: Todo repo + service ---");
  const repo = new InMemoryTodoRepository();
  const todos = new TodoService(repo);
  console.log(todos.createTodo("1", "Learn OOP"));
  console.log(todos.toggleTodo("1"));
  console.log("All todos:", repo.getAll());

  console.log("\n--- Lesson 10: Inheritance ---");
  new ConsoleNotifier().notify("OOP practice complete");

  console.log("\n--- Lesson 13: Generics ---");
  const stack = new Stack<string>();
  stack.push("a");
  stack.push("b");
  console.log("Stack pop:", stack.pop());
}

main();
