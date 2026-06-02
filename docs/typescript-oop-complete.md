# Complete OOP in TypeScript — Study Guide

A single reference from basics to patterns you use in backend code (like `d8-drill/src/user.app.ts`).

**How to use this file**

1. Read one section at a time.
2. Type every example into a file such as `src/oop-practice.ts` — do not only read.
3. After each section, do the **Try it** exercise before moving on.
4. At the end, rebuild `UserRepo` + `UserService` from memory without looking.

---

## Table of contents

1. [What is OOP?](#1-what-is-oop)
2. [Classes and objects](#2-classes-and-objects)
3. [Encapsulation](#3-encapsulation)
4. [Inheritance](#4-inheritance)
5. [Polymorphism](#5-polymorphism)
6. [Abstraction](#6-abstraction)
7. [Interfaces vs abstract classes](#7-interfaces-vs-abstract-classes)
8. [Composition vs inheritance](#8-composition-vs-inheritance)
9. [Dependency injection](#9-dependency-injection)
10. [Static members and singletons](#10-static-members-and-singletons)
11. [Generics with classes](#11-generics-with-classes)
12. [SOLID in TypeScript](#12-solid-in-typescript)
13. [Common patterns](#13-common-patterns)
14. [OOP vs functional style in TS](#14-oop-vs-functional-style-in-ts)
15. [Practice roadmap](#15-practice-roadmap)

---

## 1. What is OOP?

**Object-Oriented Programming** organizes code around **objects** that combine:

| Pillar | Meaning | TypeScript tool |
|--------|---------|-----------------|
| **Encapsulation** | Hide internal state; expose a safe API | `private`, `protected`, methods |
| **Inheritance** | Reuse behavior from a parent type | `extends` |
| **Polymorphism** | Same interface, different implementations | `implements`, method overrides |
| **Abstraction** | Hide complexity behind a simple contract | `interface`, `abstract class` |

TypeScript adds **types** on top of JavaScript classes. Types exist at compile time; classes exist at runtime.

---

## 2. Classes and objects

### Minimal class

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hi, I'm ${this.name}`;
  }
}

const p = new Person("Alex", 25);
console.log(p.greet());
```

### Parameter properties (shorthand)

Instead of declaring fields and assigning in the constructor:

```typescript
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}

  greet(): string {
    return `Hi, I'm ${this.name}`;
  }
}
```

`public` / `private` / `protected` on constructor parameters automatically create and assign fields.

### `this`

Inside methods, `this` refers to the current instance. Arrow functions on classes capture `this` from the enclosing scope (useful for callbacks).

```typescript
class Counter {
  count = 0;

  increment = (): void => {
    this.count += 1;
  };
}
```

### **Try it**

Create `class BankAccount` with `balance`, `deposit(amount)`, and `withdraw(amount)` that refuses overdraft.

---

## 3. Encapsulation

**Goal:** callers cannot corrupt internal state directly.

### Access modifiers

| Modifier | Class | Subclass | Outside |
|----------|-------|----------|---------|
| `public` | yes | yes | yes (default) |
| `protected` | yes | yes | no |
| `private` | yes | no | no |
| `#field` | yes | no | no (true private at runtime) |

```typescript
class UserRepo {
  private users: { id: string; email: string }[] = [];

  save(user: { id: string; email: string }): void {
    this.users.push(user);
  }

  findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}

const repo = new UserRepo();
// repo.users.push(...)  // Error: 'users' is private
```

### `readonly`

```typescript
class Order {
  constructor(public readonly id: string) {}
}

const o = new Order("ord_1");
// o.id = "x";  // Error
```

### Getters and setters

```typescript
class Product {
  constructor(private _price: number) {}

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value <= 0) throw new Error("Price must be positive");
    this._price = value;
  }
}
```

### **Try it**

`class Temperature` stores Celsius privately; expose `fahrenheit` getter/setter.

---

## 4. Inheritance

A **subclass** extends a **superclass** and inherits fields and methods.

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} says woof`);
  }
}

const d = new Dog("Rex");
d.move(5);
d.bark();
```

### `super`

Call the parent constructor and methods:

```typescript
class Employee extends Person {
  constructor(
    name: string,
    age: number,
    public employeeId: string
  ) {
    super(name, age); // must run before using `this`
  }

  greet(): string {
    return `${super.greet()} (ID: ${this.employeeId})`;
  }
}
```

### Method overriding

```typescript
class Shape {
  area(): number {
    return 0;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  override area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

Use `override` keyword (TypeScript 4.3+) so typos in method names are caught.

### **Try it**

`Vehicle` → `Car` and `Bike` with different `describe()` strings.

---

## 5. Polymorphism

**Polymorphism** = many shapes, one interface. Code depends on a **type contract**, not a concrete class.

```typescript
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log("Email:", message);
  }
}

class SmsNotifier implements Notifier {
  send(message: string): void {
    console.log("SMS:", message);
  }
}

function alertUser(notifier: Notifier, text: string): void {
  notifier.send(text); // works for any Notifier
}

alertUser(new EmailNotifier(), "Hello");
alertUser(new SmsNotifier(), "Hello");
```

### `implements`

```typescript
interface IUserRepository {
  save(user: { email: string }): Promise<void>;
  findByEmail(email: string): Promise<{ email: string } | undefined>;
}

class InMemoryUserRepo implements IUserRepository {
  private users: { email: string }[] = [];

  async save(user: { email: string }): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}
```

This is the same idea as your `UserRepo implements IUserRepository`.

### **Try it**

`interface PaymentProcessor` with two implementations; one function `checkout(processor, amount)`.

---

## 6. Abstraction

**Abstraction** = expose *what* something does, hide *how*.

### Abstract class

Cannot be instantiated directly. Can define abstract methods (no body) that subclasses must implement.

```typescript
abstract class BaseRepository<T> {
  protected items: T[] = [];

  abstract findById(id: string): T | undefined;

  save(item: T): void {
    this.items.push(item);
  }
}

class TodoRepo extends BaseRepository<{ id: string; title: string }> {
  findById(id: string) {
    return this.items.find((t) => t.id === id);
  }
}
```

### When to use abstract class vs interface

| Use | Prefer |
|-----|--------|
| Contract only, no shared code | `interface` |
| Shared base logic + forced overrides | `abstract class` |
| Multiple unrelated types | `interface` |

---

## 7. Interfaces vs abstract classes

### Interface

- No runtime code (erased after compile).
- A class can `implements` many interfaces.
- Best for contracts: repositories, services, adapters.

```typescript
interface Identifiable {
  id: string;
}

interface Timestamped {
  createdAt: Date;
}

class Post implements Identifiable, Timestamped {
  constructor(
    public id: string,
    public createdAt: Date,
    public title: string
  ) {}
}
```

### Abstract class

- Exists at runtime.
- Single inheritance (`extends` one class).
- Can have concrete methods and fields.

```typescript
abstract class HttpClient {
  abstract get(url: string): Promise<unknown>;

  async getJson<T>(url: string): Promise<T> {
    const data = await this.get(url);
    return data as T;
  }
}
```

### **Try it**

Define `IStorage` with `get`/`set`. Implement `MemoryStorage` and use it in a `SettingsService`.

---

## 8. Composition vs inheritance

**Inheritance** = "is-a" (`Dog is an Animal`).  
**Composition** = "has-a" (`Car has an Engine`).

Prefer **composition** when behavior should be swapped or combined without deep class trees.

```typescript
class Logger {
  log(msg: string): void {
    console.log(msg);
  }
}

class OrderService {
  constructor(private logger: Logger) {}

  createOrder(id: string): void {
    this.logger.log(`Order ${id} created`);
  }
}
```

Deep inheritance chains (`AdminUser extends User extends Entity`) become hard to change. Composition + interfaces stay flexible.

---

## 9. Dependency injection

**Dependency Injection (DI)** = give a class its dependencies from outside instead of `new` inside.

### Bad: tight coupling

```typescript
class UserService {
  private repo = new PostgresUserRepo(); // hard to test or swap
}
```

### Good: constructor injection

```typescript
class UserService {
  constructor(private userRepo: IUserRepository) {}

  async registerUser(user: { email: string }): Promise<{ success: boolean }> {
    if (await this.userRepo.findByEmail(user.email)) {
      return { success: false };
    }
    await this.userRepo.save(user);
    return { success: true };
  }
}

// Wiring at app startup (composition root)
const repo = new InMemoryUserRepo();
const service = new UserService(repo);
```

Your `d8-drill` code:

```text
app.ts          → creates UserRepo, UserService
user.app.ts     → UserService depends on IUserRepository, not Postgres
```

### Testing with a fake

```typescript
class FakeUserRepo implements IUserRepository {
  private users: UserPro[] = [];
  async save(user: UserPro) {
    this.users.push(user);
  }
  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}

const service = new UserService(new FakeUserRepo());
```

### **Try it**

`NotificationService` depends on `INotifier`. Inject a fake that records messages in an array.

---

## 10. Static members and singletons

### Static

Belong to the **class**, not each instance.

```typescript
class MathUtil {
  static PI = 3.14159;

  static clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}

console.log(MathUtil.PI);
```

### Singleton (use sparingly)

One shared instance. Often replaced by DI in apps.

```typescript
class Config {
  private static instance: Config;
  private constructor(public apiUrl: string) {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config("https://api.example.com");
    }
    return Config.instance;
  }
}
```

---

## 11. Generics with classes

Generics make classes reusable for any type while staying type-safe.

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const nums = new Stack<number>();
nums.push(1);
nums.push(2);
```

```typescript
abstract class Repository<T extends { id: string }> {
  protected store: T[] = [];

  save(entity: T): void {
    this.store.push(entity);
  }

  findById(id: string): T | undefined {
    return this.store.find((e) => e.id === id);
  }
}
```

---

## 12. SOLID in TypeScript

| Principle | One line | Example |
|-----------|----------|---------|
| **S** Single Responsibility | One class, one reason to change | `UserRepo` only stores users; `UserService` only business rules |
| **O** Open/Closed | Open for extension, closed for modification | Add `PostgresUserRepo` without editing `UserService` |
| **L** Liskov Substitution | Subtypes must honor the contract | Any `IUserRepository` works wherever repo is expected |
| **I** Interface Segregation | Small interfaces | Split `IReadRepo` / `IWriteRepo` if not all clients need both |
| **D** Dependency Inversion | Depend on abstractions | `UserService` → `IUserRepository`, not `UserRepo` |

You do not need to memorize SOLID before writing code. Notice these patterns when you refactor.

---

## 13. Common patterns

### Repository (you already use this)

Hides data access behind an interface.

```text
Service → IUserRepository → UserRepo (memory) or PostgresUserRepo (later)
```

### Factory

Creates objects without callers knowing the concrete class.

```typescript
interface ILogger {
  log(msg: string): void;
}

class ConsoleLogger implements ILogger {
  log(msg: string) {
    console.log(msg);
  }
}

class LoggerFactory {
  static create(env: "dev" | "prod"): ILogger {
    return env === "dev" ? new ConsoleLogger() : new ConsoleLogger();
  }
}
```

### Strategy

Swap algorithms at runtime via interface.

```typescript
interface DiscountStrategy {
  apply(total: number): number;
}

class NoDiscount implements DiscountStrategy {
  apply(total: number) {
    return total;
  }
}

class TenPercentOff implements DiscountStrategy {
  apply(total: number) {
    return total * 0.9;
  }
}
```

### Error class (your `AppError`)

```typescript
class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

`Object.setPrototypeOf` fixes `instanceof` when extending built-ins in some JS environments.

---

## 14. OOP vs functional style in TypeScript

TypeScript supports both. Real projects mix them.

| OOP style | Functional style |
|-----------|------------------|
| `class UserService` | `function registerUser(repo, user)` |
| `implements IUserRepository` | `type Repo = { save, findByEmail }` |
| `new UserRepo()` | Factory functions |

For Express backends, a common split:

- **OOP / classes:** services, repositories, custom errors
- **Functions:** route handlers, validators, utilities, `catchAsync(fn)`

You do not need "complete OOP everywhere" to be productive.

---

## 15. Practice roadmap

### Level 1 — Foundations (2–3 days)

- [ ] Classes, constructor, `public` / `private`
- [ ] `implements` + one in-memory repository
- [ ] Map `{ success, message }` in service (no HTTP yet)

### Level 2 — Wiring (2–3 days)

- [ ] Constructor injection
- [ ] Express route calls service
- [ ] `AppError` + global error handler

### Level 3 — Depth (1 week)

- [ ] Inheritance + `override` (small example only)
- [ ] Abstract class or generic repository
- [ ] Fake repo for mental testing
- [ ] Read SOLID table again and label your `user.app.ts` layers

### Level 4 — Production habits

- [ ] Async repository (`Promise`)
- [ ] Swap `InMemoryUserRepo` for DB repo without changing service
- [ ] `catchAsync` on async routes

### Capstone project

Build a **Todo API** from scratch:

```text
Todo (interface)
ITodoRepository → InMemoryTodoRepository
TodoService (create, list, delete, toggle)
Express routes + Zod + AppError + catchAsync
```

No copy-paste from `user.app.ts` until you are stuck for 20 minutes.

---

## Quick reference cheat sheet

```typescript
// Class + access
class Example {
  constructor(private id: string, public name: string) {}
  get label() { return this.name; }
}

// Inheritance
class Child extends Parent {
  override method() { super.method(); }
}

// Contract
interface IRepo { save(x: T): void; }
class Repo implements IRepo { ... }

// Abstract
abstract class Base {
  abstract run(): void;
}

// DI
class Service {
  constructor(private repo: IRepo) {}
}

// Polymorphism
function work(repo: IRepo) { repo.save(...); }
```

---

## Map to your `user.app.ts`

| File piece | OOP concept |
|------------|-------------|
| `UserPro` | Data shape (type, not a class) |
| `IUserRepository` | Abstraction / polymorphism |
| `UserRepo` | Encapsulation (`private users`), implements contract |
| `UserService` | Single responsibility, dependency injection |
| `app.ts` | Composition root — wires concrete classes |

When you can explain that table without looking, you understand the OOP slice you need for backend TypeScript. Full OOP theory (multiple inheritance, metaclasses, etc.) is mostly **not** required in day-to-day TS/Node work.

---

## Optional practice file

Create `d8-drill/src/oop-practice.ts` and uncomment sections as you learn. Run with:

```bash
npx ts-node src/oop-practice.ts
```

See companion file: `d8-drill/src/oop-practice.ts` (runnable examples for each level).
