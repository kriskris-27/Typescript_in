# Learn OOP in TypeScript — Simple Guide

> **Goal:** Understand classes and patterns well enough to write code like `d8-drill/src/user.app.ts` on your own.

---

## How to use this guide

```
Read one lesson → Type the code yourself → Do the mini exercise → Move on
```

**Practice file:** `d8-drill/src/oop-practice.ts`  
**Run it:** `npx ts-node src/oop-practice.ts`

Do **not** read all 759 lines in one sitting. One lesson per day is enough.

---

## What you actually need (honest answer)

| Priority | Topic | Why |
|----------|-------|-----|
| **Must know** | Classes, `private`, interfaces, `implements`, constructor injection | Your `UserRepo` + `UserService` use these |
| **Should know** | Encapsulation, polymorphism, repository pattern | Backend structure |
| **Learn later** | Inheritance, abstract classes, generics, SOLID, singletons | Useful, not required on day 1 |

You do **not** need to master all of OOP before building APIs.

---

## The big picture (read this first)

Your drill project already uses good OOP. Here is the flow:

```
HTTP request (app.ts)
       ↓
  UserService        ← "Can we register this user?" (rules)
       ↓
  IUserRepository    ← contract (what storage must do)
       ↓
  UserRepo           ← actual storage (array in memory)
```

**Three layers — remember these names:**

| Layer | Job | Your file |
|-------|-----|-----------|
| **Route** | HTTP in, HTTP out | `app.ts` |
| **Service** | Business rules | `UserService` |
| **Repository** | Save / find data | `UserRepo` |

When you understand this diagram, you understand 80% of what you need.

---

# PART 1 — Start here (Day 1–2)

---

## Lesson 1: What is a class?

**Plain English:** A class is a **blueprint**. You use `new` to create **objects** from it.

Think: cookie cutter (class) → cookies (objects).

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

const alex = new Person("Alex", 25);
console.log(alex.greet()); // "Hi, I'm Alex"
```

**Words to know**

| Word | Meaning |
|------|---------|
| `class` | Blueprint for objects |
| `constructor` | Runs when you `new` — sets up the object |
| `this` | "This specific object" inside a method |
| `new Person(...)` | Create one object from the class |

**Key takeaway:** Class = template. Object = one real instance.

### Mini exercise

Create `BankAccount` with:
- starting balance in constructor
- `deposit(amount)` — add money
- `withdraw(amount)` — refuse if not enough money
- `getBalance()` — return current balance

<details>
<summary>Solution (peek only after you try)</summary>

```typescript
class BankAccount {
  constructor(private balance: number) {}

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.balance) throw new Error("Not enough money");
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }
}
```

</details>

---

## Lesson 2: Hide data with `private` (Encapsulation)

**Plain English:** Don't let outside code touch your internal list directly. Only use your methods.

**Bad — anyone can break the array:**
```typescript
repo.users.push({ email: "hacked" }); // should not be allowed
```

**Good — only `save()` can change data:**
```typescript
class UserRepo {
  private users: { email: string }[] = [];  // hidden

  save(user: { email: string }): void {
    this.users.push(user);
  }
}
```

**Access words**

| Keyword | Who can use it? |
|---------|-----------------|
| `public` | Everyone (default) |
| `private` | Only inside this class |
| `protected` | This class + child classes (rare for beginners) |

**Key takeaway:** `private` = "keep internal stuff internal."

### Mini exercise

`class Wallet` — `private cash`. Public `add()` and `spend()`. No direct access to `cash`.

---

## Lesson 3: Interfaces — a promise of what methods exist

**Plain English:** An interface is a **contract**. It says: "Any class that implements me must have these methods."

It has **no code inside** — just shapes.

```typescript
interface IUserRepository {
  save(user: { email: string }): Promise<void>;
  findByEmail(email: string): Promise<{ email: string } | undefined>;
}
```

This does **not** store users. It only describes what a repository must do.

**Key takeaway:** Interface = checklist of methods.

---

## Lesson 4: `implements` — class fulfills the contract

```typescript
class UserRepo implements IUserRepository {
  private users: { email: string }[] = [];

  async save(user: { email: string }): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}
```

TypeScript will **error** if you forget a method from the interface. That is the point.

**This is exactly your `user.app.ts` pattern.**

**Key takeaway:** `implements` = "I promise to provide every method on the interface."

### Mini exercise

1. Write `interface ITodoRepository` with `save` and `findById`
2. Write `InMemoryTodoRepository` that implements it with a private array

(See `oop-practice.ts` Level 2 for a full example.)

---

## Lesson 5: Service class — business rules

**Plain English:** The service asks questions like "Is this email already taken?" The repository only saves and finds.

```typescript
class UserService {
  constructor(private userRepo: IUserRepository) {}

  async registerUser(user: { email: string }) {
    const existing = await this.userRepo.findByEmail(user.email);

    if (existing) {
      return { success: false, message: "User already registered" };
    }

    await this.userRepo.save(user);
    return { success: true, message: "User added" };
  }
}
```

**Rule:** Service never touches the array directly. It always goes through `userRepo`.

**Key takeaway:** Service = rules. Repository = storage.

---

## Lesson 6: Dependency injection — pass things in, don't create inside

**Plain English:** Give the service its repository from **outside**. Don't `new UserRepo()` inside `UserService`.

```typescript
// BAD — stuck with one implementation
class UserService {
  private repo = new UserRepo();
}

// GOOD — flexible and testable
class UserService {
  constructor(private userRepo: IUserRepository) {}
}

// Wire up once at app startup (in app.ts)
const repo = new UserRepo();
const service = new UserService(repo);
```

**Why it matters:** Tomorrow you swap `UserRepo` for Postgres. `UserService` stays the same.

**Key takeaway:** Constructor injection = receive dependencies, don't build them inside.

---

## Part 1 checkpoint

Can you answer these without looking?

1. What is the difference between a class and an object?
2. Why is `users` private in `UserRepo`?
3. What does `implements IUserRepository` mean?
4. What does `UserService` do vs `UserRepo`?
5. Why pass `userRepo` into the constructor?

If yes → move to Part 2. If no → redo Lessons 1–6 with `oop-practice.ts`.

---

# PART 2 — Build like your drill (Day 3–4)

---

## Lesson 7: Wire it to Express

```typescript
// app.ts — composition root (where everything connects)
const userRepository = new UserRepo();
const userService = new UserService(userRepository);

app.post("/register", async (req, res, next) => {
  const result = await userService.registerUser({
    id: crypto.randomUUID(),
    username: req.body.username,
    email: req.body.email,
  });

  if (!result.success) {
    return next(new AppError(400, result.message));
  }

  res.status(201).json({ status: "success", message: result.message });
});
```

**Who does what**

| File | Responsibility |
|------|----------------|
| `app.ts` | HTTP status codes, JSON, create repo + service |
| `UserService` | Duplicate email check |
| `UserRepo` | Store in array |

**Key takeaway:** Routes are thin. Rules live in the service.

---

## Lesson 8: Polymorphism — one slot, many implementations

**Plain English:** Write code against the **interface**, not the concrete class.

```typescript
function register(service: UserService, user: { email: string }) {
  return service.registerUser(user);
}

// Works with ANY repo that implements IUserRepository:
new UserService(new UserRepo());
new UserService(new PostgresUserRepo());  // future
new UserService(new FakeUserRepo());      // testing
```

Same function. Different storage. That is **polymorphism**.

**Key takeaway:** Depend on `IUserRepository`, not `UserRepo`.

---

## Lesson 9: Custom error class

```typescript
class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

Use in routes: `next(new AppError(400, "Email taken"))`  
Use in global handler: `if (err instanceof AppError) { ... }`

**Key takeaway:** `AppError` connects business failures to HTTP responses.

---

## Part 2 checkpoint — rebuild from memory

Close this file. In a blank `practice.ts`, build:

```
UserPro (interface)
IUserRepository (interface)
UserRepo (class)
UserService (class)
```

Then wire: `const service = new UserService(new UserRepo())`.

That proves Part 1 + 2 stuck.

---

# PART 3 — Go deeper (when you're ready)

Read these only after Part 2 feels comfortable.

---

## Lesson 10: Inheritance — reuse from a parent class

**Plain English:** Child class gets parent's methods. Use when things truly **are-a** subtype.

```typescript
class Animal {
  constructor(public name: string) {}
  move(m: number) { console.log(`${this.name} moved ${m}m`); }
}

class Dog extends Animal {
  bark() { console.log("woof"); }
}

const d = new Dog("Rex");
d.move(5);  // from Animal
d.bark();   // from Dog
```

**`super`** — call parent constructor or method:
```typescript
class Employee extends Person {
  constructor(name: string, public employeeId: string) {
    super(name); // must call parent first
  }
}
```

**Override** — replace a parent method:
```typescript
class Circle extends Shape {
  override area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

**Key takeaway:** Inheritance = "is-a". Don't overuse it — prefer interfaces for backend code.

---

## Lesson 11: Composition — "has-a" beats deep inheritance

```typescript
class Logger {
  log(msg: string) { console.log(msg); }
}

class OrderService {
  constructor(private logger: Logger) {}

  createOrder(id: string) {
    this.logger.log(`Order ${id} created`);
  }
}
```

Car **has** an engine. UserService **has** a repository. That is composition.

**Key takeaway:** Pass helpers in via constructor instead of building giant class trees.

---

## Lesson 12: Abstract class vs interface

| | Interface | Abstract class |
|---|-----------|----------------|
| Has method bodies? | No | Yes (some methods) |
| Can `new` it? | N/A | No |
| Use when | Contract only | Shared code + forced overrides |

**Default choice in TypeScript backends:** `interface` for repos and services.

---

## Lesson 13: Generics — one class, many types

```typescript
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

const nums = new Stack<number>();
nums.push(1);
```

`<T>` = "type placeholder". Like a function parameter, but for types.

---

## Lesson 14: SOLID — five rules in plain English

| Letter | Simple meaning | Your code |
|--------|------------------|-----------|
| **S** | One class, one job | `UserRepo` stores, `UserService` decides |
| **O** | Add new repos without changing service | New `PostgresUserRepo` |
| **L** | Any `IUserRepository` works in the same slot | Swap implementations |
| **I** | Small interfaces | Don't force unused methods |
| **D** | Depend on interfaces, not concrete classes | `IUserRepository` not `UserRepo` |

You don't memorize these on day 1. Notice them when you refactor.

---

## Lesson 15: Static — belongs to the class, not each object

```typescript
class MathUtil {
  static clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }
}

MathUtil.clamp(15, 0, 10); // no `new` needed
```

Use for helpers. Don't overuse for app state.

---

# Quick reference card

Copy this. Pin it while coding.

```typescript
// 1. Data shape
interface User {
  id: string;
  email: string;
}

// 2. Storage contract
interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
}

// 3. Storage implementation
class UserRepo implements IUserRepository {
  private users: User[] = [];
  async save(user: User) { this.users.push(user); }
  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}

// 4. Business rules
class UserService {
  constructor(private repo: IUserRepository) {}
  async register(user: User) {
    if (await this.repo.findByEmail(user.email)) {
      return { success: false, message: "Already exists" };
    }
    await this.repo.save(user);
    return { success: true, message: "Registered" };
  }
}

// 5. Wire at startup
const service = new UserService(new UserRepo());
```

---

# Your 7-day plan

| Day | Do this |
|-----|---------|
| 1 | Lessons 1–2 + BankAccount exercise |
| 2 | Lessons 3–6 + Todo repo exercise |
| 3 | Lessons 7–9 + read your `user.app.ts` and label each part |
| 4 | Part 2 checkpoint — rebuild from memory |
| 5 | Lesson 10 (inheritance) — small example only |
| 6 | Lessons 11–13 skim |
| 7 | Capstone: Todo API (repo + service + Express route) |

---

# Capstone project

Build a **Todo API** without copy-pasting `user.app.ts`:

```
Todo          → interface (id, title, done)
ITodoRepository → save, findById, getAll
InMemoryTodoRepository → private array
TodoService   → createTodo, toggleTodo (rules)
app.ts        → POST /todos, GET /todos
```

Add later: Zod validation, AppError, catchAsync.

---

# Map: guide → your files

| You learned | Where it lives |
|-------------|----------------|
| Interface for data | `UserPro` in `user.app.ts` |
| Storage contract | `IUserRepository` |
| Hidden array | `private users` in `UserRepo` |
| Business rules | `registerUser` in `UserService` |
| Injection | `constructor(private userRepo: ...)` |
| Wiring | `new UserRepo()` + `new UserService(...)` in `app.ts` |

When you can explain every row without opening this file, you're done with the essentials.

---

# Practice commands

```bash
cd d8-drill
npx ts-node src/oop-practice.ts
```

Edit `oop-practice.ts` as you complete each lesson. Break things on purpose — that's how you learn.
