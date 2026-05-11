import { useState, useEffect, useRef, useCallback } from "react";

// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
//  150+ QUESTION BANK
// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
const QUESTIONS = [
// ΓöÇΓöÇ OOP CORE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:1,topic:'oop',type:'output',diff:'medium',q:'What is the output?',
code:`class Base {
public:
    Base()  { cout << "B"; }
    ~Base() { cout << "~B"; }
};
class Derived : public Base {
public:
    Derived()  { cout << "D"; }
    ~Derived() { cout << "~D"; }
};
int main() { Derived d; }`,
output:'BD~D~B',
explanation:'Constructor order: BaseΓåÆDerived. Destructor order reverses: ~DerivedΓåÆ~Base.',
options:['BD~B~D','DB~B~D','BD~D~B','BD~D'],answer:2},

{id:2,topic:'oop',type:'theory',diff:'medium',q:'What is shallow copy vs deep copy? When does the default copy constructor cause problems?',
answer_text:`Shallow copy copies pointer values (addresses), not the heap data they point to.
Deep copy allocates new memory and copies the actual pointed-to data.

Problems with default (shallow) copy constructor when class owns heap memory:
ΓÇó Double-free: both objects point to same memory; deleting one corrupts the other.
ΓÇó Aliasing: modifying data through one object changes the other unexpectedly.
ΓÇó Dangling pointer after first object is destroyed.

Rule of Three (C++03): If you define destructor ΓåÆ also define copy constructor + copy assignment.
Rule of Five (C++11): Add move constructor + move assignment for efficiency.`,
options:['Shallow copies recursively; deep copies addresses only','Shallow copies pointer values causing double-free/aliasing; deep copy allocates fresh memory','Both identical for primitive types','Shallow copy is always sufficient'],answer:1},

{id:3,topic:'oop',type:'output',diff:'hard',q:'Member initialization order ΓÇö what prints?',
code:`class A {
public:
    int x;
    A(int v) : x(v) { cout << "A" << v; }
};
class B {
public:
    A a1, a2;
    B() : a2(2), a1(1) {}  // a2 listed first
};
int main() { B b; }`,
output:'A1A2',
explanation:'Members are always initialized in DECLARATION ORDER (a1 then a2), regardless of initializer list order. a2(2) listed first but a1(1) executes first.',
options:['A2A1','A1A2','A1','Undefined behavior'],answer:1},

{id:4,topic:'oop',type:'output',diff:'medium',q:'Static member counting ΓÇö what prints?',
code:`class Counter {
    static int count;
public:
    Counter()  { count++; }
    ~Counter() { count--; }
    static int get() { return count; }
};
int Counter::count = 0;
int main() {
    Counter a, b;
    { Counter c; cout << Counter::get() << " "; }
    cout << Counter::get();
}`,
output:'3 2',
explanation:'a,b,c exist ΓåÆ count=3. Inner block ends, c destroyed ΓåÆ count=2.',
options:['2 3','3 2','3 3','2 2'],answer:1},

{id:5,topic:'oop',type:'theory',diff:'hard',q:'Explain the Diamond Problem and how virtual inheritance solves it.',
answer_text:`Diamond Problem: D inherits from B and C, both of which inherit from A.
Without virtual inheritance, D contains TWO copies of A's members ΓåÆ ambiguity.

class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {};

Virtual inheritance ensures ONE shared copy of A in D. 
The most-derived class (D) is responsible for constructing the virtual base A.
Construction order: A (virtual base, first) ΓåÆ B ΓåÆ C ΓåÆ D.`,
options:['Compile error; fixed by renaming methods','Multiple inheritance from common base; virtual inheritance ensures single shared copy, most-derived class constructs it','Fixed using abstract classes only','Virtual inheritance creates multiple vtables'],answer:1},

{id:6,topic:'oop',type:'output',diff:'hard',q:'Operator overloading ΓÇö what prints?',
code:`class Vec {
public:
    int x, y;
    Vec(int a, int b): x(a), y(b) {}
    Vec operator+(const Vec& o) const { return {x+o.x, y+o.y}; }
    friend ostream& operator<<(ostream& os, const Vec& v) {
        return os << "(" << v.x << "," << v.y << ")";
    }
};
int main() {
    Vec a(1,2), b(3,4);
    cout << a + b;
}`,
output:'(4,6)',
explanation:'operator+ returns Vec{4,6}. Friend operator<< outputs "(4,6)".',
options:['(1,2)+(3,4)','4 6','(4,6)','Compile error'],answer:2},

{id:7,topic:'oop',type:'output',diff:'hard',q:'Move semantics and NRVO ΓÇö what prints?',
code:`struct R {
    R()        { cout << "C"; }
    R(const R&){ cout << "Copy"; }
    R(R&&)     { cout << "Move"; }
};
R make() { return R(); }
int main() { R r = make(); }`,
output:'C',
explanation:'NRVO (Named/Unnamed Return Value Optimization) elides the copy/move entirely. In C++17, copy elision of prvalues is mandatory. Only the constructor runs.',
options:['CMove','CCopy','C','CMoveCopy'],answer:2},

{id:8,topic:'oop',type:'theory',diff:'medium',q:'What is the Rule of Five in C++11? List all five special member functions.',
answer_text:`The Rule of Five: if a class needs to define ANY of these, it likely needs ALL five:

1. Destructor            ~MyClass()
2. Copy constructor      MyClass(const MyClass&)
3. Copy assignment       MyClass& operator=(const MyClass&)
4. Move constructor      MyClass(MyClass&&)         [C++11]
5. Move assignment       MyClass& operator=(MyClass&&)  [C++11]

Why: if you have a destructor that frees resources, the default copy/move will do shallow copies causing double-free. Move operations are needed for efficiency (avoid unnecessary heap copies).
Use =default or =delete to be explicit. Prefer Rule of Zero: use RAII types (unique_ptr, vector) so you need none.`,
options:['Constructor, destructor only','Destructor + 4 others: copy ctor, copy assign, move ctor, move assign','Only copy constructor and destructor','Constructor, destructor, copy constructor'],answer:1},

{id:9,topic:'oop',type:'output',diff:'medium',q:'What does this print? (friend function)',
code:`class Box {
    int val;
public:
    Box(int v): val(v) {}
    friend bool operator<(const Box& a, const Box& b) {
        return a.val < b.val;
    }
    friend ostream& operator<<(ostream& os, const Box& b) {
        return os << b.val;
    }
};
int main() {
    Box a(3), b(5);
    cout << (a < b) << " " << (b < a);
}`,
output:'1 0',
explanation:'a.val=3 < b.val=5 ΓåÆ trueΓåÆ1. b.val=5 < a.val=3 ΓåÆ falseΓåÆ0.',
options:['0 1','1 0','true false','Compile error'],answer:1},

{id:10,topic:'oop',type:'theory',diff:'hard',q:'What is the difference between composition, aggregation, and inheritance? When to prefer each?',
answer_text:`Composition ("has-a", strong ownership):
  class Car { Engine engine; }; // Engine lives and dies with Car
  Car owns Engine. Tightest coupling. Prefer for "part-of" relationships.

Aggregation ("has-a", weak ownership):
  class Team { vector<Player*> players; }; // Players exist independently
  Team refers to Players. Players outlive Team. Looser coupling.

Inheritance ("is-a"):
  class Dog : public Animal {}; // Dog IS an Animal
  Use ONLY when Liskov Substitution holds ΓÇö derived can replace base.
  Prefer composition over inheritance (GoF principle) to avoid fragile base class problem.

Rule: if you can say "X is a Y" and substitution holds ΓåÆ inheritance. Otherwise ΓåÆ composition/aggregation.`,
options:['All three are the same','Composition owns, aggregation references, inheritance is-a; prefer composition over inheritance','Inheritance always preferred','Aggregation and composition are identical'],answer:1},

{id:11,topic:'oop',type:'output',diff:'medium',q:'What is the output of this const member function?',
code:`class Foo {
    int x;
public:
    Foo(int v): x(v) {}
    void show() const { cout << x; }
    void inc() { x++; }
};
int main() {
    const Foo f(10);
    f.show();
    // f.inc(); // Would be compile error
}`,
output:'10',
explanation:'const objects can only call const member functions. f.show() is const ΓåÆ OK. f.inc() is non-const ΓåÆ compile error if uncommented.',
options:['10','11','Compile error','0'],answer:0},

{id:12,topic:'oop',type:'theory',diff:'medium',q:'What is a mutable keyword? When is it used?',
answer_text:`mutable allows a member to be modified even in a const member function or const object.

Use cases:
1. Caching/memoization ΓÇö lazy evaluation stored in mutable cache variable
2. Mutex locking ΓÇö lock a mutable mutex inside const method for thread safety
3. Reference counting ΓÇö mutable refcount in a "logically const" object

Example:
  class Cache {
      mutable int cached_result = -1;
  public:
      int compute() const {
          if(cached_result == -1) cached_result = heavyComputation();
          return cached_result;
      }
  };

"Logically const" but "physically mutable" ΓÇö the observable state doesn't change.`,
options:['Makes a variable global','Allows modification of member in const context ΓÇö used for caching, mutexes, ref counts','Makes member immutable','Prevents copy construction'],answer:1},

{id:13,topic:'oop',type:'output',diff:'hard',q:'What prints? (conversion constructor + implicit conversion)',
code:`class Dollars {
public:
    double amount;
    Dollars(double d): amount(d) { cout << "D"; }
};
void print(Dollars d) { cout << d.amount; }
int main() {
    print(5.0);
}`,
output:'D5',
explanation:'Implicit conversion: 5.0 is implicitly converted to Dollars(5.0) via converting constructor. "D" prints in constructor, then amount=5 prints.',
options:['5','D5','Compile error: no matching call','D5.0'],answer:1},

{id:14,topic:'oop',type:'theory',diff:'medium',q:'What does explicit keyword do on a constructor?',
answer_text:`explicit prevents implicit conversions and copy-initialization using that constructor.

Without explicit:
  Dollars d = 5.0;  // OK ΓÇö implicit conversion
  print(5.0);       // OK ΓÇö implicit conversion

With explicit Dollars(double d):
  Dollars d = 5.0;  // ERROR ΓÇö explicit constructor
  Dollars d(5.0);   // OK ΓÇö direct initialization
  Dollars d{5.0};   // OK ΓÇö list initialization
  print(static_cast<Dollars>(5.0)); // OK ΓÇö explicit cast

Best practice: mark single-argument constructors explicit unless intentional conversion is desired. Prevents hard-to-find bugs from accidental type conversions.`,
options:['Makes constructor public','Prevents implicit conversions ΓÇö single-arg constructors should be explicit unless conversion is intentional','Makes constructor virtual','Prevents inheritance'],answer:1},

{id:15,topic:'oop',type:'output',diff:'hard',q:'What is printed? (copy vs move in return)',
code:`struct S {
    int v;
    S(int x): v(x) { cout << "C" << x; }
    S(S&& o): v(o.v) { cout << "M"; o.v=0; }
    S(const S& o): v(o.v) { cout << "Cp"; }
};
int main() {
    S a(1);
    S b = move(a);
    cout << " " << a.v << " " << b.v;
}`,
output:'C1M 0 1',
explanation:'S a(1) ΓåÆ "C1". move(a) casts a to rvalue ΓåÆ move constructor runs ΓåÆ "M", a.v=0, b.v=1. Then prints " 0 1".',
options:['C1Cp 1 1','C1M 0 1','C1 1 1','C1M 1 1'],answer:1},

// ΓöÇΓöÇ INHERITANCE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:16,topic:'inherit',type:'output',diff:'medium',q:'Virtual destructor ΓÇö what prints?',
code:`class Animal {
public:
    Animal()  { cout << "Animal "; }
    virtual ~Animal() { cout << "~Animal "; }
};
class Dog : public Animal {
public:
    Dog()  { cout << "Dog "; }
    ~Dog() { cout << "~Dog "; }
};
int main() {
    Animal* p = new Dog();
    delete p;
}`,
output:'Animal Dog ~Dog ~Animal ',
explanation:'Virtual destructor ensures ~Dog() is called first (via vtable), then ~Animal(). Without virtual: ~Animal() only ΓåÆ UB/leak.',
options:['Animal Dog ~Animal ','Animal Dog ~Dog ~Animal ','Dog Animal ~Animal ~Dog ','Animal Dog ~Dog '],answer:1},

{id:17,topic:'inherit',type:'output',diff:'hard',q:'Object slicing ΓÇö what prints?',
code:`class Shape {
public:
    void draw() { cout << "Shape"; }
};
class Circle : public Shape {
public:
    void draw() { cout << "Circle"; }
};
void render(Shape s) { s.draw(); }  // by value!
int main() {
    Circle c;
    render(c);
}`,
output:'Shape',
explanation:'Object slicing: Circle passed by value as Shape loses its Circle part. draw() is non-virtual, parameter is Shape type ΓåÆ Shape::draw().',
options:['Circle','Shape','ShapeCircle','Compile error'],answer:1},

{id:18,topic:'inherit',type:'theory',diff:'medium',q:'What is the difference between public, protected, and private inheritance?',
answer_text:`Access specifier in inheritance changes the MAXIMUM access level of inherited members:

ΓÇó public inheritance (is-a):
  publicΓåÆpublic, protectedΓåÆprotected, private stays private.
  Maintains original interface. Liskov Substitution Principle applies.
  Use for "is-a" relationships.

ΓÇó protected inheritance:
  publicΓåÆprotected, protectedΓåÆprotected.
  Derived class can use base's interface but doesn't expose it externally.

ΓÇó private inheritance (has-a implementation):
  publicΓåÆprivate, protectedΓåÆprivate.
  All inherited members become private. No external access to base interface.
  Useful for "implemented-in-terms-of" ΓÇö alternative to composition.

Most OOP code uses public inheritance only.`,
options:['Control whether derived can call base constructor','Determine maximum visibility: public keeps access, protected caps at protected, private caps at private','Only affect virtual function overriding','No practical difference'],answer:1},

{id:19,topic:'inherit',type:'output',diff:'hard',q:'Virtual inheritance construction order ΓÇö what prints?',
code:`class X { public: X() { cout << "X"; } };
class Y : virtual public X { public: Y() { cout << "Y"; } };
class Z : virtual public X { public: Z() { cout << "Z"; } };
class W : public Y, public Z { public: W() { cout << "W"; } };
int main() { W w; }`,
output:'XYZW',
explanation:'With virtual inheritance: virtual base X constructed once and first. Then Y, Z, W in order. Without virtual: X would print twice.',
options:['XYZW','XZYW','YXZW','XYWZ'],answer:0},

{id:20,topic:'inherit',type:'output',diff:'hard',q:'Constructor delegation and base init ΓÇö what prints?',
code:`class A {
public:
    int val;
    A(): val(10) { cout << "A0 "; }
    A(int v): val(v) { cout << "A" << v << " "; }
};
class B : public A {
public:
    B() { cout << "B0 "; }
    B(int v): A(v) { cout << "B" << v << " "; }
};
int main() {
    B b1;
    B b2(5);
}`,
output:'A0 B0 A5 B5 ',
explanation:'B() implicitly calls A() ΓåÆ "A0 B0". B(5) calls A(5) via initializer list ΓåÆ "A5 B5".',
options:['B0 A0 B5 A5 ','A0 B0 A5 B5 ','A0 B0 B5 A5 ','A5 B5 A0 B0 '],answer:1},

{id:21,topic:'inherit',type:'theory',diff:'hard',q:'What is the Liskov Substitution Principle (LSP)? Give a classic violation example.',
answer_text:`LSP: "If S is a subtype of T, objects of type T may be replaced by objects of type S without altering correctness."

In C++: a derived class should be fully substitutable for its base class wherever the base is used.

Classic violation ΓÇö Rectangle/Square:
  class Rectangle { virtual void setWidth(int); virtual void setHeight(int); };
  class Square : public Rectangle { ... }; // Square constrains width==height

If code sets width and height independently assuming they're independent (valid for Rectangle), Square breaks that assumption ΓåÆ LSP violated.

Fix: don't inherit Square from Rectangle. Use a common abstract Shape base instead. Or make Rectangle non-virtual (prevent inheritance of behavior).`,
options:['All inheritance violates LSP','Derived should be substitutable for base; classic violation: Square inheriting Rectangle breaks width/height independence','LSP only applies to interfaces','LSP is enforced by the compiler'],answer:1},

{id:22,topic:'inherit',type:'output',diff:'medium',q:'Using declaration in derived class ΓÇö what prints?',
code:`class Base {
public:
    void func(int x) { cout << "Base:" << x; }
};
class Derived : public Base {
public:
    using Base::func;  // bring into scope
    void func(double x) { cout << "Derived:" << x; }
};
int main() {
    Derived d;
    d.func(5);     // int
    d.func(3.14);  // double
}`,
output:'Base:5Derived:3.14',
explanation:'using Base::func brings the int overload into Derived scope. d.func(5) matches Base::func(int). d.func(3.14) matches Derived::func(double).',
options:['Derived:5Derived:3.14','Base:5Derived:3.14','Compile error','Base:5Base:3'],answer:1},

{id:23,topic:'inherit',type:'theory',diff:'medium',q:'What is the fragile base class problem?',
answer_text:`When you change a base class implementation, it can break derived classes even if you didn't change the interface.

Example:
  Base::add() calls Base::addAll() internally.
  Derived overrides addAll() and calls Base::add().
  Now Base::add() ΓåÆ Derived::addAll() ΓåÆ Base::add() ΓåÆ infinite recursion!

The derived class was coupled to BASE'S IMPLEMENTATION, not just its interface.

Solutions:
ΓÇó Prefer composition over inheritance
ΓÇó Document which methods are designed for override (non-virtual by default in some guidelines)
ΓÇó Use final to prevent further derivation
ΓÇó Use the NVI (Non-Virtual Interface) pattern: public non-virtual calls private virtual`,
options:['Base class constructor is called too many times','Changing base implementation breaks derived classes even without interface change','Base class destructor is virtual','Multiple inheritance always causes this'],answer:1},

// ΓöÇΓöÇ POLYMORPHISM ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:24,topic:'poly',type:'output',diff:'medium',q:'Virtual dispatch from base ΓÇö what prints?',
code:`class Base {
public:
    virtual void show() { cout << "Base"; }
    void print() { show(); }  // NVI-like call
};
class Derived : public Base {
public:
    void show() override { cout << "Derived"; }
};
int main() {
    Derived d;
    d.print();
}`,
output:'Derived',
explanation:'print() calls show() virtually. Even though print() is in Base, "this" points to Derived at runtime ΓåÆ Derived::show() dispatched.',
options:['Base','Derived','BaseDerived','Compile error'],answer:1},

{id:25,topic:'poly',type:'output',diff:'hard',q:'Chain of virtual overrides ΓÇö what prints?',
code:`struct Base {
    virtual void f() { cout << "B"; }
    void g() { f(); }
};
struct D1 : Base {
    void f() override { cout << "D1"; }
};
struct D2 : D1 {
    void f() override { cout << "D2"; }
};
int main() {
    Base* p = new D2;
    p->g();
}`,
output:'D2',
explanation:'g() calls f() virtually. p points to D2 ΓåÆ vtable resolves to D2::f() ΓÇö the most-derived override.',
options:['B','D1','D2','BD2'],answer:2},

{id:26,topic:'poly',type:'theory',diff:'medium',q:'What is the difference between function overloading and overriding? Can both coexist?',
answer_text:`Overloading: same name, different signatures, resolved at COMPILE TIME (static dispatch).
  void f(int); void f(double); // in same scope

Overriding: derived class redefines virtual function with EXACT same signature.
  Resolved at RUNTIME via vtable (dynamic dispatch).

Coexistence and Name Hiding:
  If Base has virtual void f(int) and Derived adds void f(double):
  ΓÇó f(double) is a new overload in Derived scope
  ΓÇó f(int) from Base is HIDDEN in Derived (name hiding!)
  ΓÇó Fix: use "using Base::f;" in Derived to bring both into scope

Key: overloading = compile-time, overriding = runtime, hiding = accident.`,
options:['Overloading is runtime, overriding compile-time','Overloading is compile-time on different signatures; overriding is runtime of same virtual signature; name hiding occurs without "using"','They are the same','Overriding requires different return type'],answer:1},

{id:27,topic:'poly',type:'output',diff:'hard',q:'Pure virtual with implementation ΓÇö what prints?',
code:`class Abstract {
public:
    virtual void work() = 0;
    void run() { cout << "run-"; work(); }
};
class Concrete : public Abstract {
public:
    void work() override { cout << "work"; }
};
int main() {
    Abstract* p = new Concrete;
    p->run();
}`,
output:'run-work',
explanation:'Pure virtual functions CAN have implementations (rarely used). run() calls work() virtually. p points to Concrete ΓåÆ Concrete::work() runs.',
options:['Compile error: cannot use Abstract*','run-','work','run-work'],answer:3},

{id:28,topic:'poly',type:'output',diff:'medium',q:'Covariant return types ΓÇö what prints?',
code:`class Base {
public:
    virtual Base* clone() {
        cout << "BaseClone";
        return new Base();
    }
};
class Child : public Base {
public:
    Child* clone() override {  // covariant
        cout << "ChildClone";
        return new Child();
    }
};
int main() {
    Base* p = new Child;
    Base* c = p->clone();
}`,
output:'ChildClone',
explanation:'Covariant return type: Child* overrides Base* ΓÇö valid. Calling clone() on Base* pointing to Child dispatches to Child::clone().',
options:['BaseClone','ChildClone','BaseCloneChildClone','Compile error'],answer:1},

{id:29,topic:'poly',type:'theory',diff:'hard',q:'What is the vtable? Memory overhead and runtime cost?',
answer_text:`vtable: a per-class static array of function pointers for all virtual functions.
vptr: a hidden pointer (8 bytes on 64-bit) stored in EACH object, pointing to its class's vtable.

Memory overhead:
ΓÇó One vptr per object (8 bytes)
ΓÇó One vtable per class (N virtual functions ├ù 8 bytes each)
ΓÇó Example: 1M objects ├ù 8B vptr = 8MB extra memory

Runtime cost of virtual call vs direct call:
ΓÇó Load vptr from object (memory read #1)
ΓÇó Load function pointer from vtable at offset (memory read #2)
ΓÇó Indirect call (cannot be inlined, may cause branch misprediction, icache miss)

Typical: 1-3ns extra per virtual call on modern CPUs. Matters in tight loops.
Alternatives: CRTP (zero overhead), std::variant + visit, concepts (C++20).`,
options:['vtable has no overhead','Per-class array of function pointers; vptr (8B) per object; two extra memory reads + no inlining per call','vtable stored inside object','Only abstract classes have vtables'],answer:1},

{id:30,topic:'poly',type:'output',diff:'hard',q:'override and final keywords ΓÇö which line causes error?',
code:`class Base {
public:
    virtual void f() {}
    virtual void g() {}
};
class D1 : public Base {
public:
    void f() override {}      // OK
    void g() final {}         // g is final in D1
};
class D2 : public D1 {
public:
    // void g() override {}   // ERROR: g is final
    void f() override {}      // OK: f not final
};`,
output:'Compile error if D2::g() override is uncommented. Otherwise compiles fine.',
explanation:'"final" prevents further overriding of g() in classes derived from D1. D2 cannot override g(). "override" catches wrong signatures at compile time.',
options:['D1::f() causes error','D2::g() override causes error (g is final in D1)','final is not valid C++','override requires exact same return type'],answer:1},

{id:31,topic:'poly',type:'theory',diff:'hard',q:'What is CRTP (Curiously Recurring Template Pattern)?',
answer_text:`CRTP: template <typename Derived> class Base { ... };
       class MyClass : public Base<MyClass> { ... };

The derived class passes ITSELF as template argument to the base.
This allows BASE to call DERIVED's methods at COMPILE TIME ΓÇö static polymorphism.

Benefits vs virtual:
ΓÇó Zero runtime overhead (no vtable, fully inlineable)
ΓÇó Compile-time dispatch
ΓÇó Can be used for mixins, static interfaces

Classic uses:
1. Static interface enforcement (like concepts pre-C++20)
2. enable_shared_from_this<T>
3. Barton-Nackman trick for operator generation
4. Performance-critical hot paths (game engines, HPC)

Downsides: increases compile time, harder to read error messages, no runtime polymorphism.`,
options:['Runtime pattern for circular dependencies','Derived passes itself as template arg to base; enables compile-time static polymorphism with zero vtable overhead','Only for abstract classes','Same as virtual inheritance'],answer:1},

// ΓöÇΓöÇ TEMPLATES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:32,topic:'template',type:'output',diff:'medium',q:'Template explicit specialization ΓÇö what prints?',
code:`template<typename T>
T maxVal(T a, T b) { return (a > b) ? a : b; }

template<>
const char* maxVal(const char* a, const char* b) {
    return (strcmp(a, b) > 0) ? a : b;
}
int main() {
    cout << maxVal(3, 5) << " ";
    cout << maxVal("apple", "banana");
}`,
output:'5 banana',
explanation:'maxVal(3,5) uses generic template ΓåÆ 5. Explicit specialization for const char* uses strcmp ΓåÆ "banana" > "apple" lexicographically.',
options:['5 apple','5 banana','3 banana','Compile error'],answer:1},

{id:33,topic:'template',type:'theory',diff:'hard',q:'What is SFINAE? Give a practical example.',
answer_text:`SFINAE = "Substitution Failure Is Not An Error"

When the compiler tries to instantiate a template and encounters an error during substitution of template arguments, it SILENTLY discards that overload instead of emitting a compile error.

Practical example ΓÇö enable function only for integral types:
  template<typename T,
    typename = enable_if_t<is_integral_v<T>>>
  void process(T val) { cout << "integral: " << val; }

  template<typename T,
    typename = enable_if_t<is_floating_point_v<T>>>
  void process(T val) { cout << "float: " << val; }

  process(5);    // prints "integral: 5"
  process(3.14); // prints "float: 3.14"

C++20 replaces most SFINAE patterns with cleaner Concepts syntax.`,
options:['Template errors are silently ignored always','Substitution failure for invalid template args is silently dropped ΓÇö enables compile-time type-based dispatch via enable_if','Only for function templates','Runtime template selection'],answer:1},

{id:34,topic:'template',type:'output',diff:'hard',q:'Variadic template ΓÇö what prints?',
code:`template<typename T>
void print(T val) { cout << val << "\n"; }

template<typename T, typename... Args>
void print(T first, Args... rest) {
    cout << first << " ";
    print(rest...);
}
int main() {
    print(1, 2, 3);
}`,
output:'1 2 3\n',
explanation:'Recursive variadic: prints 1, calls print(2,3) ΓåÆ prints 2, calls print(3) ΓåÆ base case prints "3\\n".',
options:['1 2 3','1 2 3\n','3 2 1\n','Compile error'],answer:1},

{id:35,topic:'template',type:'output',diff:'medium',q:'Non-type template parameter ΓÇö what prints?',
code:`template<typename T, int N>
class Array {
    T data[N];
public:
    int size() { return N; }
    T& operator[](int i) { return data[i]; }
};
int main() {
    Array<int,5> a;
    a[2] = 42;
    cout << a.size() << " " << a[2];
}`,
output:'5 42',
explanation:'Non-type template parameter N=5 defines compile-time array size. size() returns N=5. a[2]=42 sets element, then reads it.',
options:['5 42','5 0','4 42','Compile error'],answer:0},

{id:36,topic:'template',type:'output',diff:'hard',q:'Partial specialization ΓÇö what prints?',
code:`template<typename T>
struct TypeInfo { static void print() { cout << "generic"; } };

template<typename T>
struct TypeInfo<T*> { static void print() { cout << "pointer"; } };

template<>
struct TypeInfo<int> { static void print() { cout << "int"; } };

int main() {
    TypeInfo<double>::print();
    TypeInfo<int*>::print();
    TypeInfo<int>::print();
}`,
output:'genericpointerint',
explanation:'doubleΓåÆgeneric template. int*ΓåÆpartial spec T* (T=int). intΓåÆfull specialization.',
options:['genericgenericint','genericpointerint','pointerintgeneric','Compile error'],answer:1},

{id:37,topic:'template',type:'theory',diff:'hard',q:'What is template metaprogramming? Give a compile-time factorial example.',
answer_text:`Template metaprogramming (TMP): using C++ templates to perform computations at COMPILE TIME.
The compiler evaluates template instantiations recursively, producing constants or types.

Compile-time factorial:
  template<int N>
  struct Factorial {
      static const int value = N * Factorial<N-1>::value;
  };
  template<>
  struct Factorial<0> {  // base case
      static const int value = 1;
  };

  int x = Factorial<5>::value;  // = 120, computed at compile time

Modern C++11+: use constexpr functions (cleaner):
  constexpr int factorial(int n) {
      return n <= 1 ? 1 : n * factorial(n-1);
  }
  static_assert(factorial(5) == 120);  // compile-time check

TMP is Turing-complete. Used in type traits, policy classes, expression templates.`,
options:['Runtime template computation','Using templates for compile-time computation ΓÇö Turing complete, used for type traits and compile-time constants','Only for type manipulation','Template specialization only'],answer:1},

{id:38,topic:'template',type:'output',diff:'medium',q:'Template function vs template class deduction ΓÇö what prints?',
code:`template<typename T>
T add(T a, T b) { return a + b; }

int main() {
    cout << add(1, 2) << " ";
    cout << add(1.5, 2.5) << " ";
    // cout << add(1, 2.5); // deduction fails: T=int or double?
    cout << add<double>(1, 2);
}`,
output:'3 4 3',
explanation:'add(1,2): T=intΓåÆ3. add(1.5,2.5): T=doubleΓåÆ4. add<double>(1,2): explicit T=double, 1 and 2 converted to doubleΓåÆ3.0 printed as 3.',
options:['3 4 3','3 4.0 3.0','3 4 3.0','Compile error'],answer:0},

{id:39,topic:'template',type:'theory',diff:'hard',q:'What are concepts in C++20? How do they improve on SFINAE?',
answer_text:`Concepts: named compile-time predicates that constrain template arguments.

  template<typename T>
  concept Numeric = is_arithmetic_v<T>;

  template<Numeric T>
  T add(T a, T b) { return a + b; }

Advantages over SFINAE:
1. Readable error messages: "T does not satisfy Numeric" vs cryptic SFINAE failures
2. Cleaner syntax: requires clause, abbreviated templates
3. Subsumption: concepts form a partial order, compiler picks most specialized
4. Self-documenting code

Standard library concepts (C++20):
  std::integral, std::floating_point, std::copyable, std::sortable, etc.

  // Even cleaner:
  auto add(std::integral auto a, std::integral auto b) { return a+b; }`,
options:['Runtime type constraints','Named compile-time predicates constraining templates ΓÇö cleaner than SFINAE with readable errors and subsumption','Only for classes','Same as virtual functions'],answer:1},

// ΓöÇΓöÇ STL ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:40,topic:'stl',type:'output',diff:'medium',q:'lower_bound and sort ΓÇö what prints?',
code:`#include <vector>
#include <algorithm>
int main() {
    vector<int> v = {5,1,4,2,3};
    sort(v.begin(), v.end());
    auto it = lower_bound(v.begin(), v.end(), 3);
    cout << *it << " " << (it - v.begin());
}`,
output:'3 2',
explanation:'After sort: {1,2,3,4,5}. lower_bound(3) returns iterator to first element ΓëÑ 3, which is 3 at index 2.',
options:['3 2','2 1','3 3','4 3'],answer:0},

{id:41,topic:'stl',type:'theory',diff:'medium',q:'std::map vs std::unordered_map: when to use which?',
answer_text:`std::map:
  ΓÇó Red-black tree. Keys sorted. O(log n) insert/find/erase.
  ΓÇó Iterators valid after insert. Ordered traversal.
  ΓÇó Use when: need sorted order, range queries (lower_bound), or iterator stability.

std::unordered_map:
  ΓÇó Hash table. No ordering. Average O(1) insert/find. Worst O(n) on hash collision.
  ΓÇó Requires hashable key type.
  ΓÇó Use when: maximum average-case speed, don't need order, large datasets.

Other considerations:
  ΓÇó map: predictable performance, no hash collisions possible
  ΓÇó unordered_map: larger memory footprint (bucket array + linked lists)
  ΓÇó For int/string keys: unordered_map typically 3-5x faster
  ΓÇó For custom keys: map is simpler (just need operator<)`,
options:['unordered_map always faster, use it always','map is sorted O(log n) tree; unordered_map is O(1) average hash table ΓÇö choose map for order/range, unordered for speed','They are identical except syntax','map supports duplicates, unordered_map does not'],answer:1},

{id:42,topic:'stl',type:'output',diff:'hard',q:'map operator[] side effect ΓÇö what prints?',
code:`#include <map>
int main() {
    map<string,int> m;
    m["a"] = 1; m["b"] = 2;
    auto it = m.find("c");
    if (it == m.end()) cout << "not found ";
    cout << m["c"] << " " << m.size();
}`,
output:'not found 0 3',
explanation:'find("c") returns end() ΓÇö not found. Then m["c"] uses operator[] which DEFAULT-INSERTS "c" with value 0, so size becomes 3.',
options:['not found','not found 0 3','0 3','not found 3'],answer:1},

{id:43,topic:'stl',type:'output',diff:'medium',q:'priority_queue (max-heap) ΓÇö what prints?',
code:`#include <queue>
int main() {
    priority_queue<int> pq;
    for(int x : {3,1,4,1,5}) pq.push(x);
    while(!pq.empty()) {
        cout << pq.top() << " ";
        pq.pop();
    }
}`,
output:'5 4 3 1 1 ',
explanation:'Default priority_queue is a max-heap. Elements come out in descending order.',
options:['1 1 3 4 5 ','5 4 3 1 1 ','3 1 4 1 5 ','5 4 3 2 1 '],answer:1},

{id:44,topic:'stl',type:'theory',diff:'hard',q:'What is iterator invalidation? Give two examples.',
answer_text:`Iterator invalidation: after certain container modifications, existing iterators become dangling/undefined.

std::vector:
  ΓÇó push_back/insert causing reallocation ΓåÆ ALL iterators, pointers, references invalidated
  ΓÇó erase(it) ΓåÆ iterators at and after erased element invalidated
  ΓÇó push_back without reallocation ΓåÆ end() invalidated, others valid

std::deque:
  ΓÇó Insert at middle ΓåÆ all iterators invalidated
  ΓÇó Insert at front/back ΓåÆ all iterators invalidated, but references/pointers to elements valid

std::list / std::set / std::map:
  ΓÇó Only iterators to erased elements invalidated ΓÇö all others remain valid

Best practice: after any modifying operation, re-obtain iterators rather than reusing old ones. Use return value from insert/erase.`,
options:['Iterator invalidation only in user containers','After container modifications, iterators may dangle ΓÇö vector reallocation invalidates all; list/map only invalidates erased-element iterators','Using reserve() prevents all invalidation','Invalidation only for raw pointers'],answer:1},

{id:45,topic:'stl',type:'output',diff:'hard',q:'set unique insertion ΓÇö what prints?',
code:`#include <set>
int main() {
    set<int> s = {3,1,4,1,5};
    cout << s.size() << " ";
    auto [it, ok] = s.insert(3);
    cout << ok << " ";
    cout << *s.begin();
}`,
output:'4 0 1',
explanation:'set stores unique sorted elements: {1,3,4,5} ΓåÆ size 4. Inserting 3 again: ok=false(0). First element (begin) is 1.',
options:['5 0 1','4 0 1','4 1 1','5 1 3'],answer:1},

{id:46,topic:'stl',type:'output',diff:'medium',q:'accumulate with lambda ΓÇö what prints?',
code:`#include <numeric>
#include <vector>
int main() {
    vector<int> v = {1,2,3,4,5};
    int sum = accumulate(v.begin(), v.end(), 0,
        [](int acc, int x){ return acc + x*x; });
    cout << sum;
}`,
output:'55',
explanation:'Custom binary op computes sum of squares: 1+4+9+16+25=55.',
options:['15','55','25','Compile error'],answer:1},

{id:47,topic:'stl',type:'theory',diff:'medium',q:'What is the difference between std::vector and std::deque?',
answer_text:`std::vector:
  ΓÇó Contiguous memory. Best cache performance. O(1) amortized push_back.
  ΓÇó push_front: O(n) (have to shift everything). insert at middle: O(n).
  ΓÇó Reallocation invalidates ALL iterators.

std::deque (double-ended queue):
  ΓÇó Segmented memory (array of fixed-size chunks). O(1) push_front AND push_back.
  ΓÇó Random access O(1) but slower than vector (pointer indirection).
  ΓÇó No reallocation ΓÇö insert at ends doesn't invalidate references.

Use vector: almost always ΓÇö better cache locality, known size.
Use deque: when you need efficient front insertion/deletion (e.g., BFS queue).
Both have O(1) random access but vector is typically 2-5x faster in practice.`,
options:['Deque is always faster','vector is contiguous O(1) pushback; deque is segmented O(1) push front/back but slower random access','vector supports front operations, deque does not','No practical difference'],answer:1},

{id:48,topic:'stl',type:'output',diff:'hard',q:'std::transform ΓÇö what prints?',
code:`#include <vector>
#include <algorithm>
int main() {
    vector<int> v = {1,2,3,4,5};
    vector<int> out(v.size());
    transform(v.begin(), v.end(), out.begin(),
              [](int x){ return x * x; });
    for(int x : out) cout << x << " ";
}`,
output:'1 4 9 16 25 ',
explanation:'transform applies the lambda to each element and writes to out. Squares: 1,4,9,16,25.',
options:['1 4 9 16 25 ','2 4 6 8 10 ','1 2 3 4 5 ','Compile error'],answer:0},

{id:49,topic:'stl',type:'theory',diff:'hard',q:'What is std::move_iterator and when is it useful?',
answer_text:`std::move_iterator wraps an iterator to make dereferencing return an rvalue reference instead of lvalue reference ΓÇö enabling move semantics during algorithms.

Use case: efficiently move elements from one container to another without copying.

  vector<string> src = {"hello","world","cpp"};
  vector<string> dst;
  dst.insert(dst.end(),
    make_move_iterator(src.begin()),
    make_move_iterator(src.end()));
  // src elements are now in valid-but-unspecified state
  // dst has the strings without copying

Without move_iterator: strings would be copied (O(n) each).
With move_iterator: strings are moved (O(1) each via buffer steal).

Also used with std::move algorithm (not the cast) for moving ranges.`,
options:['Only for raw pointers','Wraps iterator to produce rvalues on dereference ΓÇö enables move semantics in algorithms, avoiding copies','Same as regular iterator','Only works with vector'],answer:1},

{id:50,topic:'stl',type:'output',diff:'medium',q:'std::find_if ΓÇö what prints?',
code:`#include <vector>
#include <algorithm>
int main() {
    vector<int> v = {2,4,7,8,10};
    auto it = find_if(v.begin(), v.end(),
                      [](int x){ return x % 2 != 0; });
    if(it != v.end()) cout << *it;
    else cout << "none";
}`,
output:'7',
explanation:'find_if returns iterator to first element satisfying predicate (odd). 2 is even, 4 is even, 7 is odd ΓåÆ returns iterator to 7.',
options:['2','7','none','Compile error'],answer:1},

// ΓöÇΓöÇ EXCEPTION HANDLING ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:51,topic:'exception',type:'output',diff:'medium',q:'Basic try-catch-catch-all ΓÇö what prints?',
code:`int main() {
    try {
        cout << "A ";
        throw 42;
        cout << "B ";
    }
    catch(int e)  { cout << "C " << e << " "; }
    catch(...)    { cout << "D "; }
    cout << "E";
}`,
output:'A C 42 E',
explanation:'A prints. Exception thrown (int 42). B skipped. catch(int) matches ΓåÆ "C 42". catch(...) skipped. "E" prints.',
options:['A B C 42 E','A C 42 D E','A C 42 E','A D E'],answer:2},

{id:52,topic:'exception',type:'output',diff:'hard',q:'RAII + exception: destructor in stack unwinding ΓÇö what prints?',
code:`struct Guard {
    ~Guard() { cout << "Guard "; }
};
int main() {
    try {
        Guard g;
        cout << "Try ";
        throw runtime_error("oops");
    }
    catch(...) {
        cout << "Catch";
    }
}`,
output:'Try Guard Catch',
explanation:'RAII: "Try" prints, exception thrown, stack unwinds destroying g ΓåÆ "Guard" in destructor, then catch block ΓåÆ "Catch".',
options:['Try Catch','Guard Try Catch','Try Guard Catch','Try Catch Guard'],answer:2},

{id:53,topic:'exception',type:'theory',diff:'medium',q:'noexcept: what happens if a noexcept function throws?',
answer_text:`noexcept guarantees a function will not throw. If it does throw:
  std::terminate() is called immediately.
  Stack unwinding may or may not occur (implementation-defined).

Benefits of noexcept:
  ΓÇó Enables compiler optimizations (no need to generate unwind tables)
  ΓÇó Required for move operations to be used in containers (vector reallocation
    uses move only if move constructor is noexcept; otherwise copies)
  ΓÇó Documents intent clearly

  MyClass(MyClass&&) noexcept { ... }  // enables vector to move
  MyClass(MyClass&&) { ... }           // vector may copy instead!

noexcept(expr): conditionally noexcept based on whether expr is noexcept.
  template<typename T>
  void swap(T& a, T& b) noexcept(noexcept(T(move(a))));`,
options:['Exception propagates normally','terminate() is called; stack unwinding implementation-defined; noexcept enables move in containers and compiler optimizations','Exception is silently swallowed','Program continues normally'],answer:1},

{id:54,topic:'exception',type:'output',diff:'hard',q:'Exception re-throw ΓÇö what prints?',
code:`void inner() {
    try { throw string("error"); }
    catch(const string& s) {
        cout << "inner:" << s << " ";
        throw;  // re-throw same exception
    }
}
int main() {
    try { inner(); }
    catch(const string& s) {
        cout << "outer:" << s;
    }
}`,
output:'inner:error outer:error',
explanation:'"throw;" re-throws the SAME exception object unchanged. outer catch catches the same string "error".',
options:['inner:error','outer:error','inner:error outer:error','Compile error'],answer:2},

{id:55,topic:'exception',type:'output',diff:'medium',q:'Custom exception hierarchy ΓÇö what prints?',
code:`struct Base : exception {
    const char* what() const noexcept override { return "Base"; }
};
struct Child : Base {
    const char* what() const noexcept override { return "Child"; }
};
int main() {
    try { throw Child(); }
    catch(const Base& e) {
        cout << e.what();
    }
}`,
output:'Child',
explanation:'catch(const Base&) catches Child (derived from Base). Virtual dispatch on what() via reference ΓåÆ Child::what() ΓåÆ "Child".',
options:['Base','Child','BaseChild','Compile error'],answer:1},

{id:56,topic:'exception',type:'theory',diff:'hard',q:'What is exception safety? Define the four levels.',
answer_text:`Exception safety guarantees what state a program is in if an operation throws:

1. No guarantee: anything can happen (corrupt state, leaks). Worst.

2. Basic guarantee: no resource leaks, all invariants preserved, but 
   object may be in a different valid state. (Like std::vector partial insert)

3. Strong guarantee: operation either succeeds completely OR if it throws,
   the program state is unchanged (as if the operation never happened).
   "commit-or-rollback" semantics. Hard to achieve.

4. No-throw guarantee (noexcept): operation is guaranteed to succeed.
   Required for destructors, swap, move operations.

   void swap(T& a, T& b) noexcept; // must be no-throw

Best practices:
  ΓÇó Destructors must be noexcept (default in C++11)
  ΓÇó Use copy-and-swap idiom for strong guarantee in assignment operators
  ΓÇó Use RAII to achieve basic guarantee automatically`,
options:['Only two levels: throw or not throw','4 levels: no guarantee, basic (no leaks), strong (rollback on throw), no-throw (noexcept)','Exception safety only matters for databases','Strong guarantee is always required'],answer:1},

{id:57,topic:'exception',type:'output',diff:'hard',q:'Exception in constructor ΓÇö what happens?',
code:`struct Res {
    int* p;
    Res(): p(new int(42)) { cout << "Alloc "; }
    ~Res() { delete p; cout << "Free "; }
};
struct Bad {
    Res r;
    Bad() { cout << "Bad "; throw runtime_error("fail"); }
    ~Bad() { cout << "~Bad "; }  // NOT called!
};
int main() {
    try { Bad b; }
    catch(...) { cout << "Caught"; }
}`,
output:'Alloc Bad Caught',
explanation:'Res r constructed ΓåÆ "Alloc". Bad() starts ΓåÆ "Bad". Exception thrown. Bad is partially constructed ΓåÆ ~Bad() NOT called. But Res r WAS fully constructed ΓåÆ ~Res() IS called (but doesn\'t print here since we simplified). Then "Caught".',
options:['Alloc Bad ~Bad Caught','Alloc Bad Caught','Bad Caught','Alloc Bad Free Caught'],answer:1},

// ΓöÇΓöÇ FILE HANDLING ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:58,topic:'file',type:'theory',diff:'medium',q:'Text mode vs binary mode in C++. When to use each?',
answer_text:`Text mode (default):
  ΓÇó Newline translation: \\n Γåö \\r\\n on Windows
  ΓÇó EOF character (Ctrl+Z) may terminate reads on Windows
  ΓÇó Data treated as human-readable characters

Binary mode (ios::binary):
  ΓÇó No translation. Every byte read/written exactly as-is.
  ΓÇó Essential for images, audio, custom binary formats, structures

  ofstream f("data.bin", ios::binary);
  f.write(reinterpret_cast<char*>(&myStruct), sizeof(myStruct));

  ifstream fin("data.bin", ios::binary);
  fin.read(reinterpret_cast<char*>(&myStruct), sizeof(myStruct));

Use text mode: CSV, config files, logs, human-readable output.
Use binary mode: any non-text data. Using text mode for binary data will CORRUPT it on Windows due to \\r\\n translation.`,
options:['Binary mode compresses data','Text mode translates newlines (platform-specific); binary mode transfers bytes verbatim ΓÇö use binary for non-text to prevent corruption','No difference in modern C++','Binary mode requires manual flushing'],answer:1},

{id:59,topic:'file',type:'theory',diff:'medium',q:'What is RAII and how does it apply to file handling?',
answer_text:`RAII (Resource Acquisition Is Initialization): resource acquired in constructor, released in destructor.

File handling with RAII:
  {
      ifstream fin("data.txt");  // file opened in constructor
      // use fin...
  }  // file AUTOMATICALLY closed when fin goes out of scope

Benefits:
  ΓÇó No resource leaks even if exceptions are thrown
  ΓÇó No need to call close() manually (though you can)
  ΓÇó Deterministic cleanup
  ΓÇó Simpler code ΓÇö no error-path cleanup needed

Compared to C-style (unsafe):
  FILE* f = fopen("data.txt", "r");
  // ... if exception thrown here, fclose never called!
  fclose(f);  // must manually close on every exit path

RAII is the PREFERRED C++ pattern. std::ifstream/ofstream/fstream all use it.`,
options:['RAII means files must be manually closed','RAII ties file lifetime to stream object lifetime ΓÇö auto-closes on destruction even under exceptions','RAII only for dynamic memory','Requires using smart pointers for files'],answer:1},

{id:60,topic:'file',type:'theory',diff:'hard',q:'Explain seekg/seekp and tellg/tellp for random file access.',
answer_text:`seekg(pos, dir): move read pointer (get).
seekp(pos, dir): move write pointer (put).
tellg(): return current read position.
tellp(): return current write position.

Directions: ios::beg (from start), ios::cur (from current), ios::end (from end).

Read file size:
  fin.seekg(0, ios::end);
  streamsize size = fin.tellg();
  fin.seekg(0, ios::beg);

Overwrite specific offset in binary file:
  fstream f("data.bin", ios::in|ios::out|ios::binary); // no truncation!
  f.seekp(offset, ios::beg);
  f.write(data, sizeof(data));

True mid-file insertion (expanding): not directly supported.
Must read everything after insertion point, expand file, shift data, then write.`,
options:['seekg/seekp are deprecated','seekg moves read pointer, seekp write pointer; tellg/tellp return positions; random access requires opening without ios::trunc','Binary files cannot be seeked','seekg and seekp are identical'],answer:1},

// ΓöÇΓöÇ SMART POINTERS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:61,topic:'oop',type:'theory',diff:'medium',q:'unique_ptr vs shared_ptr vs weak_ptr ΓÇö explain all three.',
answer_text:`unique_ptr<T>:
  ΓÇó SOLE ownership. Non-copyable, movable only.
  ΓÇó Zero overhead ΓÇö literally the same as raw pointer in release builds.
  ΓÇó Destructs automatically when it goes out of scope.
  ΓÇó Use for: exclusive ownership, factory functions, PIMPL pattern.

shared_ptr<T>:
  ΓÇó SHARED ownership via reference counting (thread-safe atomic refcount).
  ΓÇó Destructs when count reaches 0.
  ΓÇó Small overhead: control block allocation, atomic refcount operations.
  ΓÇó Use for: shared ownership, when lifetime is unclear.

weak_ptr<T>:
  ΓÇó NON-OWNING observer of a shared_ptr. Does not increment refcount.
  ΓÇó Must lock() to access (returns shared_ptr or nullptr).
  ΓÇó Use for: breaking circular references, caches, observer pattern.

Circular reference problem:
  A has shared_ptr<B>, B has shared_ptr<A> ΓåÆ neither refcount reaches 0 ΓåÆ LEAK.
  Fix: make one direction a weak_ptr.`,
options:['All three are identical except syntax','unique_ptr sole owner; shared_ptr ref-counts shared ownership; weak_ptr non-owning observer ΓÇö circular shared_ptrs leak; use weak_ptr to break cycles','weak_ptr prevents all leaks automatically','shared_ptr is always preferred'],answer:1},

{id:62,topic:'oop',type:'output',diff:'hard',q:'What prints? (unique_ptr move)',
code:`#include <memory>
int main() {
    auto p = make_unique<int>(42);
    auto q = move(p);  // transfer ownership
    cout << (p == nullptr) << " ";
    cout << *q;
}`,
output:'1 42',
explanation:'After move, p is nullptr. q owns the int(42). *q=42.',
options:['0 42','1 42','Segfault','Compile error'],answer:1},

{id:63,topic:'oop',type:'output',diff:'hard',q:'shared_ptr reference counting ΓÇö what prints?',
code:`#include <memory>
int main() {
    auto a = make_shared<int>(10);
    cout << a.use_count() << " ";
    {
        auto b = a;  // shared ownership
        cout << a.use_count() << " ";
    }  // b destroyed, count decremented
    cout << a.use_count();
}`,
output:'1 2 1',
explanation:'After make_shared: count=1. After b=a: count=2. After b destroyed: count=1.',
options:['1 1 1','1 2 1','1 2 0','2 2 1'],answer:1},

// ΓöÇΓöÇ LAMBDAS / CLOSURES ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:64,topic:'stl',type:'output',diff:'medium',q:'Lambda capture by value vs reference ΓÇö what prints?',
code:`int x = 10;
auto byVal = [x]()  { return x + 1; };
auto byRef = [&x]() { return x + 1; };
x = 20;
cout << byVal() << " " << byRef();`,
output:'11 21',
explanation:'byVal captured x=10 at creation time. byRef captured reference to x; x changed to 20 ΓåÆ byRef() returns 21.',
options:['11 11','21 21','11 21','21 11'],answer:2},

{id:65,topic:'stl',type:'output',diff:'hard',q:'Mutable lambda ΓÇö what prints?',
code:`int main() {
    int x = 0;
    auto f = [x]() mutable {
        x++;
        cout << x << " ";
    };
    f(); f(); f();
    cout << x;
}`,
output:'1 2 3 0',
explanation:'mutable allows modifying captured copy of x inside lambda. Each call increments the lambda\'s own copy. Original x is unchanged (captured by value).',
options:['0 0 0 0','1 2 3 3','1 2 3 0','Compile error without mutable'],answer:2},

{id:66,topic:'stl',type:'theory',diff:'medium',q:'What are generic lambdas (C++14)? What about lambda templates (C++20)?',
answer_text:`Generic lambdas (C++14): use "auto" parameters ΓÇö the compiler generates a templated operator().

  auto add = [](auto a, auto b) { return a + b; };
  add(1, 2);      // int: 3
  add(1.5, 2.5);  // double: 4.0
  add("hi"s, "!"s); // string: "hi!"

C++20 explicit template lambdas:
  auto addTyped = []<typename T>(T a, T b) { return a + b; };
  // Can use T explicitly inside lambda body

Practical uses:
  ΓÇó Sort with custom comparator: sort(v.begin(), v.end(), [](auto& a, auto& b){ return a.key < b.key; });
  ΓÇó Visitor pattern with std::visit
  ΓÇó Generic algorithms without naming types

Lambdas are just syntactic sugar for anonymous functor classes with operator().`,
options:['Lambdas cannot be generic','C++14 auto params generate templated operator(); C++20 adds explicit template syntax for lambdas','Only C++20 supports generic lambdas','Generic lambdas use virtual dispatch'],answer:1},

// ΓöÇΓöÇ ADVANCED OOP ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:67,topic:'oop',type:'theory',diff:'hard',q:'What is the PIMPL idiom? What are its benefits?',
answer_text:`PIMPL (Pointer to IMPLementation) = Cheshire Cat pattern:
Move all private implementation details to a separate class accessed via pointer.

  // header (widget.h)
  class Widget {
  public:
      Widget();
      ~Widget();
      void draw();
  private:
      struct Impl;
      unique_ptr<Impl> pImpl;  // opaque pointer
  };

  // source (widget.cpp) ΓÇö Impl details hidden
  struct Widget::Impl {
      // heavy includes, data members, etc.
  };

Benefits:
  1. Compilation firewall: changing Impl doesn't recompile header users
  2. ABI stability: binary interface of Widget doesn't change
  3. Hide implementation details from users
  4. Reduce compile-time dependencies (move #includes to .cpp)

Cost: one extra indirection, heap allocation for Impl, can't inline.`,
options:['Just for hiding public members','Move private implementation to opaque pointer ΓÇö reduces compile dependencies, provides ABI stability, hides implementation','Equivalent to inheritance','Only useful in large projects'],answer:1},

{id:68,topic:'oop',type:'output',diff:'hard',q:'What prints? (initializer list priority)',
code:`class S {
public:
    S(initializer_list<int> il) { cout << "IL:" << il.size(); }
    S(int a, int b) { cout << "AB"; }
};
int main() {
    S a{1, 2};    // uses initializer_list!
    S b(1, 2);    // uses (int,int)
}`,
output:'IL:2AB',
explanation:'Brace-init {1,2}: initializer_list constructor preferred if it can accept the args. Paren-init (1,2): uses (int,int) constructor.',
options:['ABAB','IL:2IL:2','IL:2AB','ABIL:2'],answer:2},

{id:69,topic:'oop',type:'theory',diff:'hard',q:'What are the differences between struct and class in C++?',
answer_text:`The ONLY technical differences in C++:

1. Default access: struct members are public by default, class are private.
2. Default inheritance: struct inherits public by default, class inherits private.

That's it. Both support everything: constructors, destructors, virtual functions, templates, inheritance.

Conventions/idioms:
  ΓÇó struct: used for passive data holders (POD-like), no invariants, public everything.
           C compatibility in headers.
  ΓÇó class: used when there's encapsulation, invariants to maintain, private data.

Example:
  struct Point { int x, y; };  // passive data
  class BankAccount { ... };   // encapsulated with invariants

Neither is "better" ΓÇö use based on semantic intent.`,
options:['struct cannot have member functions','Only difference: struct=public default, class=private default; by convention struct for passive data, class for encapsulated types','struct cannot inherit','class is always preferred in modern C++'],answer:1},

{id:70,topic:'oop',type:'output',diff:'hard',q:'What prints? (static vs virtual)',
code:`class Base {
public:
    static void staticF()  { cout << "Base::static "; }
    virtual void virtualF(){ cout << "Base::virtual "; }
};
class Derived : public Base {
public:
    static void staticF()  { cout << "Derived::static "; }
    void virtualF() override{ cout << "Derived::virtual "; }
};
int main() {
    Base* p = new Derived();
    p->staticF();   // static: resolved at compile time!
    p->virtualF();  // virtual: resolved at runtime
}`,
output:'Base::static Derived::virtual ',
explanation:'Static functions are NOT virtual ΓÇö resolved at compile time based on POINTER TYPE (Base*). virtualF() is virtual ΓÇö runtime dispatch to Derived.',
options:['Derived::static Derived::virtual ','Base::static Base::virtual ','Base::static Derived::virtual ','Compile error'],answer:2},

// ΓöÇΓöÇ MORE ADVANCED TOPICS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:71,topic:'template',type:'output',diff:'hard',q:'What prints? (fold expressions C++17)',
code:`template<typename... Args>
auto sum(Args... args) {
    return (... + args);  // unary left fold
}
int main() {
    cout << sum(1,2,3,4,5);
}`,
output:'15',
explanation:'Fold expression (... + args) expands to ((((1+2)+3)+4)+5) = 15.',
options:['5','15','Compile error','1+2+3+4+5'],answer:1},

{id:72,topic:'stl',type:'output',diff:'medium',q:'std::optional ΓÇö what prints?',
code:`#include <optional>
optional<int> safeDivide(int a, int b) {
    if(b == 0) return nullopt;
    return a / b;
}
int main() {
    auto r1 = safeDivide(10, 2);
    auto r2 = safeDivide(5, 0);
    cout << r1.value_or(-1) << " ";
    cout << r2.value_or(-1);
}`,
output:'5 -1',
explanation:'10/2=5 returned as optional<int>. Division by zero returns nullopt. value_or(-1) returns -1 for nullopt.',
options:['5 0','5 -1','Compile error','10 5'],answer:1},

{id:73,topic:'stl',type:'theory',diff:'hard',q:'What is std::variant? How does it compare to union?',
answer_text:`std::variant<A,B,C>: a type-safe tagged union that can hold ONE of several types.

  variant<int, double, string> v;
  v = 42;
  cout << get<int>(v);     // 42
  v = "hello";
  cout << get<string>(v);  // "hello"
  // get<int>(v) now throws bad_variant_access

vs C-style union:
  union { int i; double d; };  // unsafe: no tracking of active member
                                 // calling wrong accessor = UB

Benefits of variant:
  1. Type-safe ΓÇö tracks which type is active
  2. Destructs active member properly
  3. Works with std::visit for exhaustive handling
  4. No undefined behavior

  visit([](auto& v){ cout << v; }, myVariant);  // handles all types

Use cases: error-or-value returns, AST nodes, command pattern, discriminated unions.`,
options:['variant is just a renamed union','variant is a type-safe tagged union tracking active member; visit enables exhaustive handling ΓÇö no UB unlike C union','variant requires dynamic allocation','variant is slower than union'],answer:1},

{id:74,topic:'stl',type:'output',diff:'hard',q:'structured bindings ΓÇö what prints?',
code:`#include <map>
#include <tuple>
int main() {
    map<string,int> m = {{"a",1},{"b",2}};
    for(auto& [key, val] : m) {
        cout << key << val << " ";
    }
    auto [x,y,z] = tuple{1,2.5,"hi"};
    cout << x << " " << y;
}`,
output:'a1 b2 1 2.5',
explanation:'Structured bindings decompose pairs in map iteration ΓåÆ "a1 b2". Then tuple decomposition ΓåÆ x=1, y=2.5, z="hi". Prints "1 2.5".',
options:['a1 b2 1 2.5','a b 1 2','Compile error','a1 b2 1 2'],answer:0},

{id:75,topic:'oop',type:'theory',diff:'hard',q:'What is the Non-Virtual Interface (NVI) pattern?',
answer_text:`NVI: public non-virtual functions call private virtual functions.
The public interface is stable; the customization point is private/protected.

  class Widget {
  public:
      void draw() {  // non-virtual, public ΓÇö the interface
          beforeDraw();
          doDraw();   // private virtual ΓÇö the customization point
          afterDraw();
      }
  private:
      virtual void doDraw() = 0;  // override in derived
  };

  class Circle : public Widget {
  private:
      void doDraw() override { /* draw circle */ }
  };

Benefits:
  1. Base class controls pre/post conditions (beforeDraw, afterDraw always run)
  2. Interface is stable ΓÇö callers only see draw()
  3. Template Method Pattern implemented cleanly
  4. Derived classes can't accidentally bypass invariants

Used extensively in: std::iostream, date/time libraries, GUI frameworks.`,
options:['Virtual functions must be public','NVI: public non-virtual calls private virtual ΓÇö base controls pre/post conditions, derived customizes only the implementation point','NVI prevents virtual functions','Same as CRTP'],answer:1},

{id:76,topic:'poly',type:'output',diff:'medium',q:'typeid and dynamic_cast ΓÇö what prints?',
code:`#include <typeinfo>
class Base { public: virtual ~Base(){} };
class Derived : public Base {};
int main() {
    Base* p = new Derived();
    cout << (dynamic_cast<Derived*>(p) != nullptr) << " ";
    cout << typeid(*p).name()[0];  // first char of mangled name
}`,
output:'1 7 (or similar, implementation-defined for name)',
explanation:'dynamic_cast<Derived*>(p): p actually points to Derived ΓåÆ cast succeeds, non-null ΓåÆ 1. typeid(*p) is Derived (runtime type). name() is implementation-defined.',
options:['0 B','1 D (first char implementation-defined)','Compile error','1 7'],answer:1},

{id:77,topic:'template',type:'theory',diff:'hard',q:'What are type traits? Give examples from <type_traits>.',
answer_text:`Type traits: compile-time predicates and transformations on types, available in <type_traits>.

Predicates (is_xxx<T>::value or is_xxx_v<T>):
  is_integral_v<int>       ΓåÆ true
  is_pointer_v<int*>       ΓåÆ true
  is_polymorphic_v<Base>   ΓåÆ true (has virtual function)
  is_trivially_copyable_v<int> ΓåÆ true (can memcpy)
  is_same_v<int, int>      ΓåÆ true

Transformations:
  remove_const_t<const int>  ΓåÆ int
  add_pointer_t<int>         ΓåÆ int*
  decay_t<int&>              ΓåÆ int  (array/function decay + remove ref/const)
  conditional_t<cond,A,B>    ΓåÆ A if cond, else B

Custom type trait:
  template<typename T>
  struct IsVector : false_type {};
  template<typename T>
  struct IsVector<vector<T>> : true_type {};

Used extensively in: enable_if, static_assert, concepts, library implementations.`,
options:['Runtime type checking like RTTI','Compile-time predicates and transformations on types ΓÇö is_integral, remove_const, etc. ΓÇö enable meta-programming and SFINAE','Only for primitive types','Same as dynamic_cast'],answer:1},

{id:78,topic:'exception',type:'theory',diff:'hard',q:'What is std::terminate vs std::abort vs std::exit?',
answer_text:`std::terminate():
  ΓÇó Called when: unhandled exception, noexcept violation, exception in destructor during unwinding.
  ΓÇó Calls current terminate handler (customizable via set_terminate).
  ΓÇó Default handler calls abort().

std::abort():
  ΓÇó Sends SIGABRT, terminates abnormally.
  ΓÇó NO cleanup: no destructors, no atexit handlers, no flushing of output.
  ΓÇó Used for unrecoverable errors, contract violations.

std::exit(int code):
  ΓÇó Calls destructors of static/thread-local objects.
  ΓÇó Calls atexit/at_quick_exit handlers.
  ΓÇó Flushes/closes open file streams.
  ΓÇó Does NOT call destructors of local variables!

std::quick_exit(): calls at_quick_exit handlers, no flush, no static destructors.

Order of "graceful" cleanup: exit > quick_exit > abort > terminate(ΓåÆabort).`,
options:['All three are identical','terminate() calls handler (default:abort); abort() is immediate no-cleanup; exit() does partial cleanup (static dtors, atexit) but not local dtors','terminate() is recoverable','abort() flushes streams'],answer:1},

{id:79,topic:'stl',type:'output',diff:'hard',q:'std::string_view ΓÇö what prints?',
code:`#include <string_view>
void print(string_view sv) {
    cout << sv.size() << ":" << sv;
}
int main() {
    string s = "hello world";
    print(s);            // from string
    print("literal");    // from string literal
    print({s.data()+6,5}); // substring view
}`,
output:'11:hello world7:literal5:world',
explanation:'string_view is a non-owning view. s has 11 chars. "literal" has 7. Substring from offset 6 length 5 = "world".',
options:['11:hello world7:literal5:world','Compile error','11:hello7:literal','11 7 5'],answer:0},

{id:80,topic:'oop',type:'output',diff:'hard',q:'What prints? (delegating constructors C++11)',
code:`class Config {
    int width, height;
    string title;
public:
    Config(int w, int h, string t): width(w), height(h), title(t) {
        cout << "Full ";
    }
    Config(int w, int h): Config(w, h, "Default") {
        cout << "WH ";
    }
    Config(): Config(800, 600) {
        cout << "Empty ";
    }
};
int main() { Config c; }`,
output:'Full WH Empty ',
explanation:'Config() delegates to Config(800,600) which delegates to Config(800,600,"Default"). Chain runs innermost first: "Full", then "WH", then "Empty".',
options:['Empty WH Full ','Full WH Empty ','Full Empty ','Compile error'],answer:1},

// ΓöÇΓöÇ 81-100: ADDITIONAL VARIED QUESTIONS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:81,topic:'oop',type:'output',diff:'medium',q:'What prints? (prefix vs postfix operator overload)',
code:`class Int {
    int v;
public:
    Int(int x): v(x) {}
    Int& operator++()    { ++v; return *this; } // prefix
    Int  operator++(int) { Int tmp=*this; ++v; return tmp; } // postfix
    operator int() { return v; }
};
int main() {
    Int x(5);
    cout << ++x << " " << x++ << " " << x;
}`,
output:'6 6 7',
explanation:'++x: prefix, increments to 6, returns reference to x ΓåÆ prints 6. x++: postfix, saves 6, increments to 7, returns old value 6 ΓåÆ prints 6. x is now 7 ΓåÆ prints 7.',
options:['6 7 7','6 6 7','5 6 7','Compile error'],answer:1},

{id:82,topic:'inherit',type:'output',diff:'hard',q:'What prints? (virtual function in constructor)',
code:`class Base {
public:
    Base() { f(); }
    virtual void f() { cout << "Base "; }
};
class Derived : public Base {
public:
    Derived() { f(); }
    void f() override { cout << "Derived "; }
};
int main() { Derived d; }`,
output:'Base Derived ',
explanation:'During Base constructor, vtable points to Base ΓÇö so f() calls Base::f(). After Base finishes, Derived constructor runs with full vtable ΓåÆ Derived::f().',
options:['Derived Derived ','Base Derived ','Base Base ','Derived Base '],answer:1},

{id:83,topic:'stl',type:'theory',diff:'medium',q:'What is the difference between std::sort, std::stable_sort, and std::partial_sort?',
answer_text:`std::sort(first, last, comp):
  ΓÇó Introsort (hybrid quicksort+heapsort+insertion). O(n log n) average AND worst case.
  ΓÇó NOT stable (equal elements may reorder).
  ΓÇó Best for general-purpose sorting.

std::stable_sort(first, last, comp):
  ΓÇó Merge sort based. O(n log n) guaranteed but slower constant factor.
  ΓÇó STABLE: equal elements preserve original relative order.
  ΓÇó Use when: sorting by multiple criteria sequentially, or equal elements must stay ordered.

std::partial_sort(first, middle, last, comp):
  ΓÇó Sorts only [first, middle) ΓÇö the smallest (middle-first) elements.
  ΓÇó O(n log k) where k = middle - first.
  ΓÇó Use when: you only need top-k elements (leaderboard, top-10).

std::nth_element(first, nth, last):
  ΓÇó Partitions so nth element is what it would be if sorted.
  ΓÇó O(n) average. Use for median, percentiles.`,
options:['All three are identical except name','sort is O(n log n) unstable introsort; stable_sort preserves equal-element order; partial_sort O(n log k) for top-k','stable_sort is faster','partial_sort sorts the whole array'],answer:1},

{id:84,topic:'template',type:'output',diff:'medium',q:'What prints? (if constexpr C++17)',
code:`template<typename T>
void describe(T val) {
    if constexpr (is_integral_v<T>)
        cout << "int:" << val;
    else if constexpr (is_floating_point_v<T>)
        cout << "float:" << val;
    else
        cout << "other";
}
int main() {
    describe(42);
    describe(3.14);
    describe("hi");
}`,
output:'int:42float:3.14other',
explanation:'if constexpr evaluates at compile time. Each instantiation only compiles the matching branch. No runtime overhead.',
options:['int:42float:3.14other','Compile error','int:42 float:3.14 other','42 3.14 hi'],answer:0},

{id:85,topic:'oop',type:'theory',diff:'medium',q:'What is the copy-and-swap idiom and why is it useful?',
answer_text:`Copy-and-swap: implement operator= using copy constructor + swap.

  MyClass& operator=(MyClass other) {  // parameter is a COPY
      swap(*this, other);  // swap guts
      return *this;
  }  // other (old data) destroyed here

Why it's brilliant:
  1. Exception safety: copy happens before we touch *this; if copy throws, *this unchanged ΓåÆ STRONG guarantee.
  2. Self-assignment safe: parameter is a copy; swapping with self = no-op.
  3. DRY: reuses copy constructor logic.
  4. Works for move assignment too (parameter can be moved into).

Requires a noexcept swap:
  friend void swap(MyClass& a, MyClass& b) noexcept {
      using std::swap;
      swap(a.data, b.data);  // swap each member
  }`,
options:['Just a coding pattern with no benefits','Implements operator= via copy + swap ΓÇö provides strong exception safety, self-assignment safety, and DRY code reuse','Only for primitive types','Slower than direct assignment always'],answer:1},

{id:86,topic:'poly',type:'output',diff:'hard',q:'What prints? (abstract class with concrete method)',
code:`class Shape {
public:
    virtual double area() const = 0;
    void describe() const {
        cout << "Area=" << area();
    }
};
class Circle : public Shape {
    double r;
public:
    Circle(double r): r(r) {}
    double area() const override { return 3.14 * r * r; }
};
int main() {
    Circle c(2.0);
    c.describe();
}`,
output:'Area=12.56',
explanation:'describe() calls area() virtually. c is a Circle ΓåÆ Circle::area() = 3.14*4 = 12.56.',
options:['Area=0','Area=12.56','Compile error','Area=6.28'],answer:1},

{id:87,topic:'exception',type:'output',diff:'medium',q:'Multiple catch clauses ΓÇö order matters. What prints?',
code:`class Base { public: virtual ~Base(){} };
class Derived : public Base {};
int main() {
    try {
        throw Derived();
    }
    catch(Base& b)    { cout << "Base "; }
    catch(Derived& d) { cout << "Derived "; }  // unreachable!
}`,
output:'Base ',
explanation:'catch clauses checked in ORDER. Derived is-a Base ΓåÆ first catch(Base&) matches. catch(Derived&) is never reached. Always put most-derived first!',
options:['Derived ','Base ','Base Derived ','Compile error'],answer:1},

{id:88,topic:'stl',type:'output',diff:'medium',q:'std::span (C++20) ΓÇö what prints?',
code:`#include <span>
void printAll(span<int> s) {
    for(int x : s) cout << x << " ";
}
int main() {
    int arr[] = {1,2,3,4,5};
    printAll(arr);
    printAll({arr+1, 3});  // subspan
}`,
output:'1 2 3 4 5 2 3 4 ',
explanation:'span is a non-owning view over contiguous data. printAll(arr) views all 5 elements. {arr+1, 3} views 3 elements starting at index 1: {2,3,4}.',
options:['1 2 3 4 5 2 3 4 ','1 2 3 4 5 1 2 3 ','Compile error','1 2 3 4 5 '],answer:0},

{id:89,topic:'oop',type:'theory',diff:'hard',q:'Explain the Observer pattern in C++ with OOP principles.',
answer_text:`Observer: defines a one-to-many dependency ΓÇö when subject state changes, all observers notified.

  class Observer {
  public:
      virtual void update(int state) = 0;
      virtual ~Observer() = default;
  };

  class Subject {
      vector<Observer*> observers;
      int state;
  public:
      void attach(Observer* o) { observers.push_back(o); }
      void setState(int s) {
          state = s;
          for(auto* o : observers) o->update(s);
      }
  };

  class Logger : public Observer {
      void update(int s) override { cout << "Log: " << s; }
  };

Modern C++ alternatives:
  ΓÇó Use std::function<void(int)> callbacks instead of Observer interface
  ΓÇó Signals/slots (Qt, Boost.Signals2)
  ΓÇó Avoid raw pointers: use weak_ptr<Observer> to auto-unsubscribe on destruction`,
options:['Observer requires multiple inheritance','Subject notifies registered Observers when state changes ΓÇö loose coupling via abstract Observer interface; modern C++ can use std::function callbacks','Observer is a creational pattern','Only applicable for UI programming'],answer:1},

{id:90,topic:'template',type:'theory',diff:'hard',q:'What is tag dispatching? Give an example.',
answer_text:`Tag dispatching: use empty types (tags) as function arguments to select between overloads at compile time.

  struct input_iterator_tag {};
  struct random_access_iterator_tag : input_iterator_tag {};

  template<typename It>
  void advance_impl(It& it, int n, input_iterator_tag) {
      for(int i=0;i<n;i++) ++it;  // O(n)
  }
  template<typename It>
  void advance_impl(It& it, int n, random_access_iterator_tag) {
      it += n;  // O(1)
  }
  template<typename It>
  void advance(It& it, int n) {
      advance_impl(it, n, typename iterator_traits<It>::iterator_category{});
  }

This is how std::advance picks efficient algorithm per iterator type.
Zero runtime overhead ΓÇö tag is empty class, optimized away.
Modern C++: if constexpr or concepts are cleaner alternatives.`,
options:['Runtime type dispatch','Empty type arguments select overloads at compile time ΓÇö used by std iterators for category-based algorithm selection','Same as RTTI','Only for iterator types'],answer:1},

{id:91,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::any)',
code:`#include <any>
int main() {
    any a = 42;
    cout << any_cast<int>(a) << " ";
    a = string("hello");
    cout << any_cast<string>(a).size() << " ";
    try { any_cast<int>(a); }  // wrong type!
    catch(bad_any_cast&) { cout << "bad"; }
}`,
output:'42 5 bad',
explanation:'any holds any type. Cast to correct type works. Casting string to int throws bad_any_cast.',
options:['42 5 bad','42 hello bad','Compile error','42 5 0'],answer:0},

{id:92,topic:'inherit',type:'theory',diff:'hard',q:'What is multiple inheritance? What problems can it cause?',
answer_text:`Multiple inheritance: a class derives from more than one base class.
  class C : public A, public B {};

Problems:
1. Diamond problem: if A and B both inherit from same base Z, C gets two Z copies.
   Fix: virtual inheritance.

2. Ambiguity: if A and B have same method name f(), C::f() is ambiguous.
   Fix: explicitly scope: A::f() or B::f(), or override in C.

3. Complexity: hard to understand, maintain, reason about.

4. Fragile base class: changes in either base can break C.

Best practices:
  ΓÇó Inherit from at most ONE concrete class + multiple interfaces (pure abstract).
  ΓÇó Java/C# approach: single concrete inheritance + multiple interface implementation.
  ΓÇó Prefer composition over multiple concrete inheritance.
  ΓÇó Use mixin pattern (small, focused base classes via CRTP or protected inheritance).`,
options:['Multiple inheritance is always good','Inheriting from multiple bases ΓÇö problems: diamond (virtual inheritance fix), ambiguity, complexity; prefer one concrete + multiple abstract bases','Multiple inheritance is not supported in C++','Only causes problems with virtual functions'],answer:1},

{id:93,topic:'oop',type:'output',diff:'hard',q:'What prints? (virtual function table with multiple inheritance)',
code:`struct A {
    virtual void f() { cout << "A"; }
    virtual ~A() {}
};
struct B {
    virtual void f() { cout << "B"; }
    virtual ~B() {}
};
struct C : A, B {
    void f() override { cout << "C"; }
};
int main() {
    A* pa = new C();
    B* pb = new C();
    pa->f();
    pb->f();
}`,
output:'CC',
explanation:'Both pa and pb point to a C object. C overrides f() from both A and B. Virtual dispatch always resolves to C::f() regardless of pointer type.',
options:['AB','CA','CC','Compile error: ambiguous f()'],answer:2},

{id:94,topic:'template',type:'output',diff:'hard',q:'What prints? (template template parameter)',
code:`template<template<typename> class Container, typename T>
void fill(Container<T>& c, T val, int n) {
    for(int i=0;i<n;i++) c.push_back(val);
}
int main() {
    vector<int> v;
    fill(v, 42, 3);
    cout << v.size() << " " << v[1];
}`,
output:'3 42',
explanation:'Template template parameter accepts Container<T> generically. fill pushes 42 three times ΓåÆ size=3, v[1]=42.',
options:['3 42','Compile error','3 0','0 42'],answer:0},

{id:95,topic:'stl',type:'theory',diff:'hard',q:'What are allocators in STL? When would you write a custom one?',
answer_text:`Allocators: policy classes that decouple memory allocation from container logic.
Every STL container has an Allocator template parameter (default: std::allocator<T>).

Custom allocator reasons:
1. Pool allocator: pre-allocate large block, serve from it ΓÇö avoids heap fragmentation, faster for many small allocations.
2. Arena allocator: allocate from a fixed buffer (stack or mmap'd) ΓÇö no heap at all.
3. Debug allocator: track allocations, detect double-free/leaks.
4. NUMA-aware: allocate on specific memory node for HPC.
5. GPU memory: allocate in device memory.

Custom allocator interface:
  template<typename T>
  class MyAlloc {
  public:
      using value_type = T;
      T* allocate(size_t n) { return static_cast<T*>(myPool.get(n*sizeof(T))); }
      void deallocate(T* p, size_t n) { myPool.release(p); }
  };

  vector<int, MyAlloc<int>> v;  // uses custom allocator`,
options:['Allocators are only for debugging','Policy classes for memory management in containers ΓÇö custom ones used for pool allocation, arena, debug tracking, NUMA, GPU memory','Only std::allocator works','Allocators are deprecated in C++17'],answer:1},

{id:96,topic:'poly',type:'output',diff:'hard',q:'What prints? (multiple dispatch via std::visit)',
code:`#include <variant>
using Shape = variant<int,double,string>;
int main() {
    vector<Shape> shapes = {1, 3.14, string("hi")};
    for(auto& s : shapes) {
        visit([](auto& v){ cout << v << " "; }, s);
    }
}`,
output:'1 3.14 hi ',
explanation:'std::visit dispatches to the generic lambda with the actual stored type. Simulates double dispatch / multiple dispatch pattern.',
options:['1 3.14 hi ','Compile error','1 3 hi ','All print same type'],answer:0},

{id:97,topic:'exception',type:'theory',diff:'medium',q:'What is the difference between try-catch and function-try-block?',
answer_text:`Regular try-catch: placed inside function body.
  void f() {
      try { /* code */ } catch(...) { /* handle */ }
  }

Function-try-block: catches exceptions from the ENTIRE function body + member initializer list.
  class MyClass {
      Widget w;
  public:
      MyClass() try : w(/* might throw */) {
          // constructor body
      }
      catch(exception& e) {
          // catches exceptions from both initializer list AND body
          // NOTE: must re-throw or std::terminate is called for constructors
      }
  };

Function-try-block is the ONLY way to catch exceptions from member initializer lists.
Used for: cleanup in constructor when base/member init throws.
Limitation: constructor function-try-block must rethrow (can't suppress exception and use partially-constructed object).`,
options:['They are identical','Function-try-block also catches initializer-list exceptions ΓÇö only way to handle base/member init throws; must rethrow in constructors','Function-try-block is deprecated','Regular try-catch can catch initializer exceptions'],answer:1},

{id:98,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::tie for tuple unpacking)',
code:`#include <tuple>
int main() {
    int a, b, c;
    tie(a, b, c) = make_tuple(10, 20, 30);
    cout << a << " " << b << " " << c;
    // Ignore middle:
    tie(a, ignore, c) = make_tuple(1, 99, 3);
    cout << " " << a << " " << c;
}`,
output:'10 20 30 1 3',
explanation:'tie creates a tuple of references. Assignment unpacks tuple values. ignore discards the 99.',
options:['10 20 30 1 3','10 20 30 1 99 3','Compile error','10 20 30'],answer:0},

{id:99,topic:'oop',type:'theory',diff:'hard',q:'Explain SOLID principles in C++ context.',
answer_text:`S ΓÇö Single Responsibility: a class should have ONE reason to change.
     Don't mix parsing + business logic + UI in one class.

O ΓÇö Open/Closed: open for extension, closed for modification.
     Add behavior via new derived classes / policies, not modifying existing code.
     Strategy pattern, templates, virtual functions achieve this.

L ΓÇö Liskov Substitution: derived types must be substitutable for base type.
     If Base* p works correctly, Derived* p should too. No strengthening preconditions.

I ΓÇö Interface Segregation: prefer many small interfaces over one large one.
     class IPrint { virtual void print()=0; };
     class IScan { virtual void scan()=0; };
     Better than one fat IDevice with both.

D ΓÇö Dependency Inversion: depend on abstractions, not concretions.
     class Logger { unique_ptr<IOutput> out; };  // depends on interface
     Not: class Logger { FileOutput out; };  // depends on concrete type`,
options:['SOLID is a design philosophy with no C++ impact','S=single responsibility, O=open/closed, L=Liskov substitution, I=interface segregation, D=dependency inversion ΓÇö each has concrete C++ implications','Only S and O matter','SOLID only applies to Java'],answer:1},

{id:100,topic:'oop',type:'output',diff:'hard',q:'What prints? (copy elision / RVO)',
code:`struct Heavy {
    Heavy() { cout << "Ctor "; }
    Heavy(const Heavy&) { cout << "Copy "; }
    Heavy(Heavy&&) { cout << "Move "; }
};
Heavy make() {
    return Heavy();  // RVO applies
}
Heavy make2() {
    Heavy h;
    return h;  // NRVO may apply
}
int main() {
    Heavy a = make();   // RVO
    Heavy b = make2();  // NRVO
}`,
output:'Ctor Ctor ',
explanation:'RVO and NRVO (Named RVO) eliminate copy/move entirely in both cases. Objects constructed directly in place. Only Ctor prints twice.',
options:['Ctor Copy Ctor Copy','Ctor Move Ctor Move','Ctor Ctor ','Ctor Copy Ctor Move'],answer:2},

// ΓöÇΓöÇ QUESTIONS 101-155 ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
{id:101,topic:'oop',type:'output',diff:'hard',q:'What prints? (virtual + default arguments)',
code:`class Base {
public:
    virtual void f(int x = 10) { cout << "B:" << x; }
};
class Derived : public Base {
public:
    void f(int x = 20) override { cout << "D:" << x; }
};
int main() {
    Base* p = new Derived();
    p->f();
}`,
output:'D:10',
explanation:'Default arguments are resolved at COMPILE TIME based on STATIC type (Base*) ΓåÆ x=10. Virtual dispatch is RUNTIME ΓåÆ Derived::f() is called. Result: "D:10". Tricky!',
options:['B:10','D:20','D:10','B:20'],answer:2},

{id:102,topic:'template',type:'output',diff:'hard',q:'What prints? (SFINAE with enable_if)',
code:`template<typename T, enable_if_t<is_integral_v<T>>* = nullptr>
void show(T v) { cout << "int:" << v; }

template<typename T, enable_if_t<is_floating_point_v<T>>* = nullptr>
void show(T v) { cout << "float:" << v; }

int main() {
    show(5);
    show(3.14);
}`,
output:'int:5float:3.14',
explanation:'enable_if_t enables/disables overloads based on type. show(5) ΓåÆ integral overload. show(3.14) ΓåÆ floating_point overload.',
options:['int:5int:3.14','int:5float:3.14','Compile error','float:5float:3.14'],answer:1},

{id:103,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::unique and std::erase)',
code:`#include <vector>
#include <algorithm>
int main() {
    vector<int> v = {1,1,2,3,3,4};
    auto newEnd = unique(v.begin(), v.end());
    v.erase(newEnd, v.end());
    for(int x : v) cout << x << " ";
}`,
output:'1 2 3 4 ',
explanation:'unique moves duplicates to end and returns iterator to new logical end. erase removes them. Result: {1,2,3,4}.',
options:['1 1 2 3 3 4 ','1 2 3 4 ','1 2 3 ','Compile error'],answer:1},

{id:104,topic:'oop',type:'output',diff:'hard',q:'What prints? (order of evaluation in constructor init list)',
code:`class A {
public:
    int x, y;
    A(int v): y(v), x(y+1) {}  // y initialized before x in list but x declared first!
};
int main() {
    A a(10);
    cout << a.x << " " << a.y;
}`,
output:'garbage 10 (undefined behavior)',
explanation:'x is declared before y, so x is initialized first ΓÇö but x(y+1) uses uninitialized y! This is UB. Compiler warns about this. Always init in declaration order.',
options:['11 10','10 10','garbage 10 (UB)','Compile error'],answer:2},

{id:105,topic:'poly',type:'theory',diff:'hard',q:'What is double dispatch? How is it implemented in C++?',
answer_text:`Double dispatch: selecting a function based on BOTH the type of the object AND the type of an argument at runtime.

C++ vtable only supports single dispatch (one virtual lookup). Double dispatch requires workarounds:

1. Visitor pattern (classic):
   class ShapeVisitor { virtual void visit(Circle&)=0; virtual void visit(Square&)=0; };
   class Shape { virtual void accept(ShapeVisitor&)=0; };
   class Circle : Shape { void accept(ShapeVisitor& v) override { v.visit(*this); }};
   // Now v.visit(*this) dispatches on BOTH Shape type AND visitor type.

2. std::visit with std::variant (modern C++17):
   using Shape = variant<Circle, Square>;
   visit(overloaded{
     [](Circle& c, Square& s) { /* circle+square */ },
     ...
   }, shape1, shape2);

3. Dynamic cast table: map of typeid pairs to functions (ugly, avoid).

Visitor is preferred for stable type hierarchies. variant+visit for extensible types.`,
options:['Double dispatch is automatic in C++','Selecting based on two types at runtime ΓÇö visitor pattern or std::variant+visit, since C++ vtable only does single dispatch','Double dispatch requires multiple inheritance','Same as function overloading'],answer:1},

{id:106,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::partition)',
code:`#include <vector>
#include <algorithm>
int main() {
    vector<int> v = {1,2,3,4,5,6};
    auto it = partition(v.begin(), v.end(), [](int x){ return x%2==0; });
    for(int x : v) cout << x << " ";
    cout << "| " << (it - v.begin());
}`,
output:'(even numbers first, then odd ΓÇö order within each group not guaranteed) | 3',
explanation:'partition reorders: evens {2,4,6} first, then odds {1,3,5}. Returns iterator to first odd. it-begin=3. Order within groups not guaranteed.',
options:['2 4 6 1 3 5 | 3','1 2 3 4 5 6 | 3','Compile error','Even order guaranteed'],answer:0},

{id:107,topic:'oop',type:'theory',diff:'medium',q:'What is the Singleton pattern? What are its pitfalls?',
answer_text:`Singleton: ensures a class has exactly one instance with global access.

  class Singleton {
      static Singleton* instance;
      Singleton() {}  // private constructor
  public:
      static Singleton& get() {
          static Singleton inst;  // Meyer's singleton (thread-safe in C++11)
          return inst;
      }
      Singleton(const Singleton&) = delete;
      Singleton& operator=(const Singleton&) = delete;
  };

Pitfalls:
1. Global state: hard to test (no dependency injection), hidden dependencies.
2. Lifetime issues: static initialization order fiasco between translation units.
3. Thread safety: double-checked locking is tricky (Meyer's singleton is safe in C++11).
4. Hard to unit test: can't mock a singleton easily.
5. Anti-pattern arguments: often better to pass dependencies explicitly.

Prefer Meyer's singleton (local static) which is thread-safe in C++11+.`,
options:['Singleton is always the best pattern','Ensures one instance + global access; pitfalls: global state, testability, hidden dependencies; prefer Meyer\'s local static','Singleton prevents compilation issues','Requires multiple inheritance'],answer:1},

{id:108,topic:'template',type:'theory',diff:'hard',q:'What is expression templates? Give an example use case.',
answer_text:`Expression templates: a TMP technique where expressions are represented as types rather than being evaluated eagerly.

Problem: naive vector math copies intermediate results:
  Vector a,b,c,d;
  Vector result = a + b + c + d;
  // Without ET: creates temp for (a+b), temp for (a+b+c), then final
  // Each temp = malloc + copy ΓÇö very slow for large vectors

With expression templates: a+b returns an Add<Vec,Vec> type (not a vector).
Adding more: Add<Add<Vec,Vec>,Vec>. Evaluation happens only at assignment.
Final loop: result[i] = a[i]+b[i]+c[i]+d[i] ΓÇö ONE PASS, no temporaries.

Libraries using expression templates:
  ΓÇó Eigen (matrix math) ΓÇö used in ML, robotics, graphics
  ΓÇó Blaze ΓÇö linear algebra
  ΓÇó Boost.Proto ΓÇö DSL construction
  ΓÇó Old PETE library

C++20 concepts make ET cleaner. C++23 constexpr improvements help further.`,
options:['Runtime template evaluation','Templates representing expressions as types to avoid temporaries in math ΓÇö one-pass evaluation used by Eigen, Blaze','Only for string concatenation','Same as lazy evaluation in Python'],answer:1},

{id:109,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::bind vs lambda)',
code:`#include <functional>
int add(int a, int b) { return a + b; }
int main() {
    auto add5 = bind(add, placeholders::_1, 5);
    auto add5L = [](int x){ return x + 5; };
    cout << add5(3) << " " << add5L(3);
    function<int(int)> f = add5;
    cout << " " << f(10);
}`,
output:'8 8 15',
explanation:'bind partially applies add with second arg=5. Lambda equivalent. function<> type-erases callable. All produce same results.',
options:['8 8 15','3 3 10','Compile error','8 8 10'],answer:0},

{id:110,topic:'inherit',type:'output',diff:'hard',q:'What prints? (hiding vs overriding)',
code:`class Base {
public:
    virtual void f(int x) { cout << "B(int)"; }
    void g(int x) { cout << "Bg"; }
};
class Derived : public Base {
public:
    void f(double x) { cout << "D(double)"; }  // hides, not overrides!
    void g(double x) { cout << "Dg"; }
};
int main() {
    Derived d;
    d.f(5);    // int ΓåÆ double? or Base::f?
    d.g(5);
}`,
output:'D(double)Dg',
explanation:'Derived::f(double) HIDES Base::f(int) in derived scope. d.f(5) ΓåÆ 5 converted to double ΓåÆ Derived::f(double). Same for g. To access Base::f: use d.Base::f(5) or "using Base::f;".',
options:['B(int)Bg','D(double)Dg','Compile error','B(int)Dg'],answer:1},

{id:111,topic:'oop',type:'output',diff:'medium',q:'What prints? (delete operator)',
code:`class Tracked {
public:
    static int alive;
    Tracked() { alive++; }
    ~Tracked() { alive--; }
};
int Tracked::alive = 0;
int main() {
    Tracked* p = new Tracked();
    cout << Tracked::alive << " ";
    delete p;
    cout << Tracked::alive;
}`,
output:'1 0',
explanation:'new ΓåÆ constructor ΓåÆ alive=1. delete ΓåÆ destructor ΓåÆ alive=0.',
options:['0 0','1 1','1 0','0 1'],answer:2},

{id:112,topic:'template',type:'output',diff:'medium',q:'What prints? (auto return type deduction)',
code:`template<typename T, typename U>
auto multiply(T a, U b) { return a * b; }

int main() {
    auto r1 = multiply(3, 4);
    auto r2 = multiply(2.5, 4);
    cout << r1 << " " << r2;
}`,
output:'12 10',
explanation:'multiply(3,4): T=int,U=intΓåÆint 12. multiply(2.5,4): T=double,U=int ΓåÆ double 10.0 printed as 10.',
options:['12 10','12 10.0','Compile error','12.0 10.0'],answer:0},

{id:113,topic:'stl',type:'theory',diff:'medium',q:'What are the complexity guarantees of std::unordered_set operations?',
answer_text:`std::unordered_set uses a hash table internally.

Operation complexities:
ΓÇó insert: Average O(1), Worst O(n) [all elements hash to same bucket]
ΓÇó find: Average O(1), Worst O(n)
ΓÇó erase: Average O(1), Worst O(n)
ΓÇó count: Average O(1), Worst O(n)

The worst case occurs with hash collisions. To avoid:
1. Use good hash functions (distribute evenly)
2. Reserve bucket count: s.reserve(1000) to avoid rehashing
3. Set max_load_factor before inserting

Rehashing: when load_factor() > max_load_factor() (default 1.0), rehash occurs ΓåÆ O(n) but amortized O(1).

Iterator invalidation: rehashing invalidates all iterators!
Use insert return value to re-obtain iterators after bulk inserts.`,
options:['Always O(log n)','Average O(1) insert/find/erase with worst O(n) on hash collisions ΓÇö rehashing invalidates all iterators','Always O(1) guaranteed','O(n) for all operations'],answer:1},

{id:114,topic:'poly',type:'output',diff:'medium',q:'What prints? (interface class pattern)',
code:`class IDrawable {
public:
    virtual void draw() const = 0;
    virtual ~IDrawable() = default;
};
class IResizable {
public:
    virtual void resize(double factor) = 0;
    virtual ~IResizable() = default;
};
class Rect : public IDrawable, public IResizable {
    double w, h;
public:
    Rect(double w, double h): w(w), h(h) {}
    void draw() const override { cout << w << "x" << h; }
    void resize(double f) override { w*=f; h*=f; }
};
int main() {
    Rect r(4,3);
    r.resize(2);
    r.draw();
}`,
output:'8x6',
explanation:'resize(2): w=8, h=6. draw(): "8x6". Multiple interface inheritance is clean C++ design.',
options:['4x3','8x6','Compile error','8.0x6.0'],answer:1},

{id:115,topic:'oop',type:'theory',diff:'hard',q:'What is the Curiously Recurring Template Pattern (CRTP) for adding functionality to derived classes?',
answer_text:`CRTP Mixin pattern: add functionality to derived classes via template base without virtual dispatch.

  template<typename Derived>
  class Comparable {
  public:
      bool operator!=(const Derived& o) const {
          return !(static_cast<const Derived&>(*this) == o);
      }
      bool operator<=(const Derived& o) const {
          return !(o < static_cast<const Derived&>(*this));
      }
      // Derived only needs operator== and operator<
  };

  class Point : public Comparable<Point> {
      int x, y;
  public:
      bool operator==(const Point& o) const { return x==o.x && y==o.y; }
      bool operator<(const Point& o) const { return x<o.x || (x==o.x && y<o.y); }
  };

  Point a(1,2), b(3,4);
  a != b;  // uses Comparable::operator!=, no virtual dispatch, inlineable

Use cases: enable_shared_from_this, iterator bases, operator generation (Boost.Operators), static polymorphism.`,
options:['CRTP only for virtual functions','CRTP base generates derived functionality at compile time ΓÇö zero overhead mixins; used for operator generation, static interfaces, enable_shared_from_this','Requires dynamic_cast','Only for single inheritance'],answer:1},

{id:116,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::iota)',
code:`#include <numeric>
#include <vector>
int main() {
    vector<int> v(5);
    iota(v.begin(), v.end(), 10);
    for(int x : v) cout << x << " ";
}`,
output:'10 11 12 13 14 ',
explanation:'iota fills with sequentially increasing values starting from 10: {10,11,12,13,14}.',
options:['0 1 2 3 4 ','10 11 12 13 14 ','10 20 30 40 50 ','Compile error'],answer:1},

{id:117,topic:'exception',type:'output',diff:'medium',q:'What prints? (nested try-catch)',
code:`int main() {
    try {
        try {
            throw string("inner");
        }
        catch(int) {
            cout << "int ";
        }
        // string not caught ΓåÆ propagates up
        cout << "after inner ";
    }
    catch(string& s) {
        cout << "string:" << s;
    }
}`,
output:'string:inner',
explanation:'Inner catch(int) doesn\'t match string. Exception propagates to outer catch(string&) ΓåÆ "string:inner". "after inner" never reached.',
options:['after inner string:inner','string:inner','int string:inner','Compile error'],answer:1},

{id:118,topic:'template',type:'output',diff:'hard',q:'What prints? (constexpr if with type dispatch)',
code:`template<typename T>
auto convert(T val) {
    if constexpr (is_same_v<T, string>)
        return stoi(val);     // only compiled for string
    else if constexpr (is_integral_v<T>)
        return to_string(val); // only compiled for int
    else
        return val;
}
int main() {
    auto a = convert(string("42"));
    auto b = convert(42);
    cout << a << " " << b;
}`,
output:'42 42',
explanation:'if constexpr only compiles the matching branch. convert(string) ΓåÆ stoi ΓåÆ int 42. convert(42) ΓåÆ to_string ΓåÆ string "42". Both print as "42 42".',
options:['42 42','"42" 42','42 "42"','Compile error'],answer:0},

{id:119,topic:'oop',type:'theory',diff:'medium',q:'What is the Factory Method pattern in C++?',
answer_text:`Factory Method: define an interface for creating objects, but let derived classes decide which class to instantiate.

  class Animal {
  public:
      virtual string speak() = 0;
      virtual ~Animal() = default;
  };
  class Dog : public Animal {
      string speak() override { return "Woof!"; }
  };
  class Cat : public Animal {
      string speak() override { return "Meow!"; }
  };

  // Factory function (functional style)
  unique_ptr<Animal> makeAnimal(string type) {
      if(type == "dog") return make_unique<Dog>();
      if(type == "cat") return make_unique<Cat>();
      throw invalid_argument("Unknown animal");
  }

Benefits:
  ΓÇó Decouples creation from usage
  ΓÇó Easy to add new types without changing existing code (Open/Closed)
  ΓÇó Returns smart pointer ΓåÆ automatic lifetime management

Modern C++: often just a free function or static method, not a full pattern class.`,
options:['Factory pattern requires virtual constructors','Defines interface for object creation; subclasses/functions decide which concrete type to instantiate ΓÇö decouples creation from use','Factory is only for Singleton','Requires protected constructors'],answer:1},

{id:120,topic:'stl',type:'output',diff:'hard',q:'What prints? (parallel algorithms C++17)',
code:`#include <execution>
#include <vector>
#include <algorithm>
#include <numeric>
int main() {
    vector<int> v(1000000);
    iota(v.begin(), v.end(), 1);
    auto s = reduce(execution::par, v.begin(), v.end(), 0LL);
    cout << (s == 500000500000LL ? "correct" : "wrong");
}`,
output:'correct',
explanation:'C++17 parallel reduce with execution::par. Sum of 1..1000000 = n(n+1)/2 = 500000500000. Parallel reduce is associative so result matches sequential.',
options:['wrong','correct','Compile error','0'],answer:1},

{id:121,topic:'oop',type:'output',diff:'hard',q:'What prints? (type conversion operator)',
code:`class Fraction {
    int num, den;
public:
    Fraction(int n, int d): num(n), den(d) {}
    explicit operator double() const {
        return static_cast<double>(num) / den;
    }
    operator string() const {
        return to_string(num) + "/" + to_string(den);
    }
};
int main() {
    Fraction f(3,4);
    // double d = f;  // ERROR: explicit
    double d = static_cast<double>(f);
    string s = f;  // implicit OK: not explicit
    cout << d << " " << s;
}`,
output:'0.75 3/4',
explanation:'explicit operator double requires cast. operator string is implicit. Both work correctly.',
options:['0.75 3/4','Compile error','3/4 0.75','0.75 0.75'],answer:0},

{id:122,topic:'template',type:'theory',diff:'hard',q:'What are policy-based design and policy classes?',
answer_text:`Policy-based design: compose classes from small, orthogonal behaviors (policies) via template parameters. Used heavily by Alexandrescu (Modern C++ Design).

  template<
      typename StoragePolicy = HeapStorage,
      typename ThreadingPolicy = SingleThreaded,
      typename CheckingPolicy = NoChecking
  >
  class SmartPtr : public StoragePolicy,
                   public ThreadingPolicy,
                   public CheckingPolicy {
      // combines all behaviors
  };

  using ThreadSafePtr = SmartPtr<HeapStorage, MultiThreaded, DebugCheck>;
  using FastPtr = SmartPtr<StackStorage, SingleThreaded, NoChecking>;

Benefits:
  ΓÇó Zero cost abstractions (inlined at compile time)
  ΓÇó Mix and match behaviors without inheritance hierarchies
  ΓÇó Used in: std::allocator, Loki library, EASTL, Abseil

vs Strategy pattern: Strategy is runtime (virtual), Policy is compile-time (template).`,
options:['Runtime configuration of class behavior','Compose class behavior from template policy parameters ΓÇö compile-time zero-cost composition used in allocators, smart pointers, library internals','Same as multiple inheritance','Only for memory management'],answer:1},

{id:123,topic:'oop',type:'output',diff:'medium',q:'What prints? (inherit constructor C++11)',
code:`class Base {
public:
    Base(int x)    { cout << "B(int):" << x; }
    Base(double x) { cout << "B(dbl):" << x; }
};
class Derived : public Base {
public:
    using Base::Base;  // inherit ALL Base constructors
};
int main() {
    Derived d1(42);
    Derived d2(3.14);
}`,
output:'B(int):42B(dbl):3.14',
explanation:'"using Base::Base" inherits all Base constructors into Derived. d1(42) calls Base(int). d2(3.14) calls Base(double).',
options:['B(int):42B(dbl):3.14','Compile error','B(int):42B(int):3','Derived has no constructors'],answer:0},

{id:124,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::merge)',
code:`#include <algorithm>
#include <vector>
int main() {
    vector<int> a = {1,3,5}, b = {2,4,6};
    vector<int> out(6);
    merge(a.begin(),a.end(), b.begin(),b.end(), out.begin());
    for(int x : out) cout << x << " ";
}`,
output:'1 2 3 4 5 6 ',
explanation:'std::merge merges two sorted ranges into one sorted range. Both inputs must be sorted.',
options:['1 3 5 2 4 6 ','1 2 3 4 5 6 ','2 4 6 1 3 5 ','Compile error'],answer:1},

{id:125,topic:'oop',type:'theory',diff:'medium',q:'What is aggregate initialization and when can you use it?',
answer_text:`Aggregate: a class/struct with:
  ΓÇó No user-provided constructors (can have =default)
  ΓÇó No private/protected non-static data members
  ΓÇó No virtual functions, no virtual/private/protected base classes
  ΓÇó No base classes with private/protected members
  (rules relaxed in C++17: can have base classes)

Aggregate initialization with braces:
  struct Point { int x, y; };
  Point p{3, 4};  // x=3, y=4 ΓÇö no constructor needed
  Point q = {5, 6};  // also OK

  // C++17: aggregate can have base classes
  struct ColorPoint : Point { int color; };
  ColorPoint cp{{1,2}, 0xFF0000};  // base + own members

  // Partial init: remaining members zero-initialized
  Point r{5};  // x=5, y=0

Benefits: simple, efficient, no constructor overhead.
Breaks if any user constructor added or member becomes private.`,
options:['Any class can use aggregate initialization','Structs/classes meeting specific criteria (no user constructors, public members, no virtual) can be brace-initialized in member order','Only for C-compatible structs','Requires all members initialized'],answer:1},

{id:126,topic:'poly',type:'output',diff:'medium',q:'What prints? (abstract class cannot be instantiated)',
code:`class AbstractAnimal {
public:
    virtual void speak() = 0;
    virtual ~AbstractAnimal() = default;
};
class Dog : public AbstractAnimal {
public:
    void speak() override { cout << "Woof"; }
};
int main() {
    // AbstractAnimal a;  // ERROR
    AbstractAnimal* p = new Dog();
    p->speak();
    delete p;
}`,
output:'Woof',
explanation:'Abstract classes cannot be instantiated directly. Pointer to abstract type is fine. new Dog() creates concrete Dog, speak() dispatches to Dog::speak().',
options:['Compile error','Woof','(nothing)','Runtime error'],answer:1},

{id:127,topic:'stl',type:'theory',diff:'hard',q:'What is the difference between std::list and std::forward_list?',
answer_text:`std::list: doubly-linked list.
  ΓÇó Bidirectional iteration (++ and --)
  ΓÇó O(1) insert/erase anywhere given iterator
  ΓÇó O(n) random access (no operator[])
  ΓÇó Each node: data + 2 pointers = more memory
  ΓÇó Supports: push_front, push_back, insert, erase, splice, sort, merge

std::forward_list: singly-linked list (C++11).
  ΓÇó Forward iteration only (++ only, no --)
  ΓÇó O(1) insert/erase AFTER a given iterator (insert_after, erase_after)
  ΓÇó Slightly less memory per node (only 1 pointer)
  ΓÇó No size() method! (doesn't store count)
  ΓÇó Supports: push_front only (no push_back in O(1))

When to use list: need bidirectional iteration + frequent middle insert/erase.
When to use forward_list: memory-constrained, need only single-pass forward traversal.
Reality: vector outperforms both in most cases due to cache locality. Prefer vector unless profiling shows list is better.`,
options:['forward_list is just an alias for list','list is doubly-linked (bidirectional); forward_list is singly-linked (forward only, less memory, insert_after) ΓÇö vector usually beats both','list is deprecated','forward_list supports random access'],answer:1},

{id:128,topic:'oop',type:'output',diff:'hard',q:'What prints? (return value optimization with named temp)',
code:`struct Obj {
    int id;
    Obj(int i): id(i) { cout << "C" << i; }
    Obj(Obj&& o): id(o.id) { cout << "M"; }
    ~Obj() { cout << "D" << id; }
};
vector<Obj> v;
int main() {
    v.reserve(2);  // prevent reallocation
    v.emplace_back(1);
    v.emplace_back(2);
    cout << " done ";
}`,
output:'C1C2 done D2D1',
explanation:'emplace_back constructs in-place (no move). reserve prevents reallocation. Destructor order: last-in first-out when vector destroyed.',
options:['C1C2 done D1D2','C1M C2M done D2D1','C1C2 done D2D1','Compile error'],answer:2},

{id:129,topic:'template',type:'output',diff:'medium',q:'What prints? (class template argument deduction C++17)',
code:`template<typename T>
class Wrapper {
    T val;
public:
    Wrapper(T v): val(v) { cout << val; }
};
// Deduction guide
template<typename T>
Wrapper(T) -> Wrapper<T>;

int main() {
    Wrapper w1{42};       // deduced Wrapper<int>
    Wrapper w2{3.14};     // deduced Wrapper<double>
    Wrapper w3{"hello"};  // deduced Wrapper<const char*>
}`,
output:'423.14hello',
explanation:'C++17 CTAD (Class Template Argument Deduction) deduces T from constructor argument. Each wrapper prints its value.',
options:['423.14hello','Compile error','42 3.14 hello','int double const char*'],answer:0},

{id:130,topic:'inherit',type:'output',diff:'hard',q:'What prints? (protected member access)',
code:`class Base {
protected:
    int secret = 42;
};
class Derived : public Base {
public:
    void show() { cout << secret; }  // access own protected
    void show(Base& b) {
        // cout << b.secret;  // ERROR: cannot access OTHER object's protected!
        cout << "no";
    }
};
int main() {
    Derived d;
    d.show();
}`,
output:'42',
explanation:'Protected members accessible from within derived class for THIS object. Accessing another Base object\'s protected from derived is NOT allowed.',
options:['42','no','Compile error','0'],answer:0},

{id:131,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::adjacent_difference)',
code:`#include <numeric>
#include <vector>
int main() {
    vector<int> v = {1,3,6,10,15};
    vector<int> d(5);
    adjacent_difference(v.begin(), v.end(), d.begin());
    for(int x : d) cout << x << " ";
}`,
output:'1 2 3 4 5 ',
explanation:'adjacent_difference: d[0]=v[0]=1, d[i]=v[i]-v[i-1]. 1, 3-1=2, 6-3=3, 10-6=4, 15-10=5.',
options:['1 2 3 4 5 ','1 3 6 10 15 ','0 2 3 4 5 ','Compile error'],answer:0},

{id:132,topic:'oop',type:'theory',diff:'hard',q:'What is the Template Method Pattern in C++ OOP?',
answer_text:`Template Method: define the skeleton of an algorithm in a base class, with some steps deferred to subclasses. Uses NVI naturally.

  class DataProcessor {
  public:
      // Template method ΓÇö defines algorithm skeleton
      void process() {
          readData();      // non-virtual hook
          parseData();     // virtual step 1
          validateData();  // virtual step 2 with default
          writeOutput();   // virtual step 3
      }
  protected:
      virtual void parseData() = 0;
      virtual void validateData() { /* default: no-op */ }
      virtual void writeOutput() = 0;
  private:
      void readData() { /* always same */ }
  };

  class CSVProcessor : public DataProcessor {
  protected:
      void parseData() override { /* parse CSV */ }
      void writeOutput() override { /* write result */ }
  };

Benefits: code reuse for algorithm structure, customization only at variation points.
Related to: Strategy (composition-based), Hook Methods (optional overrides).`,
options:['Template Method uses template functions','Base defines algorithm skeleton with virtual steps ΓÇö subclasses customize steps, base controls order/pre/post conditions','Requires C++ templates','Same as Strategy pattern'],answer:1},

{id:133,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::rotate)',
code:`#include <algorithm>
#include <vector>
int main() {
    vector<int> v = {1,2,3,4,5};
    rotate(v.begin(), v.begin()+2, v.end());
    for(int x : v) cout << x << " ";
}`,
output:'3 4 5 1 2 ',
explanation:'rotate makes v.begin()+2 (element 3) the new first element. Left-rotates by 2 positions: {3,4,5,1,2}.',
options:['1 2 3 4 5 ','3 4 5 1 2 ','5 4 3 2 1 ','2 3 4 5 1 '],answer:1},

{id:134,topic:'oop',type:'output',diff:'hard',q:'What prints? (multiple inheritance + constructor order)',
code:`struct X { X() { cout << "X"; } ~X() { cout << "~X"; } };
struct Y { Y() { cout << "Y"; } ~Y() { cout << "~Y"; } };
struct Z : X, Y {
    Z() { cout << "Z"; }
    ~Z() { cout << "~Z"; }
};
int main() { Z z; }`,
output:'XYZ~Z~Y~X',
explanation:'Multiple inheritance: base constructors called in DECLARATION ORDER (X then Y). Destructor reverse: ~Z, ~Y, ~X.',
options:['XYZ~X~Y~Z','YXZ~Z~X~Y','XYZ~Z~Y~X','Compile error'],answer:2},

{id:135,topic:'template',type:'theory',diff:'medium',q:'What is std::decltype and when is it useful?',
answer_text:`decltype: deduces the TYPE of an expression at compile time without evaluating it.

  int x = 5;
  decltype(x) y = 10;  // y is int
  decltype(x+1.0) z;   // z is double (int + double = double)

Useful for:
1. Trailing return type (pre-C++14):
   template<typename A, typename B>
   auto add(A a, B b) -> decltype(a+b) { return a+b; }

2. Perfect forwarding / generic programming:
   decltype(auto) get() { return someFunc(); }  // preserves ref/cv-qual

3. Type metaprogramming:
   using MapValueType = decltype(myMap)::mapped_type;

4. SFINAE:
   template<typename T>
   auto f(T t) -> decltype(t.size(), void()) { /* only if t.size() valid */ }

decltype(auto): like auto but preserves references and cv-qualifiers.
  int& ref = x;
  auto a = ref;        // a is int (copies)
  decltype(auto) b = ref; // b is int& (reference!)`,
options:['Runtime type query like typeid','Compile-time type deduction of expression ΓÇö used for trailing return types, type metaprogramming, decltype(auto) for reference preservation','Same as auto','Only for function return types'],answer:1},

{id:136,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::count_if)',
code:`#include <algorithm>
#include <vector>
int main() {
    vector<int> v = {1,2,3,4,5,6,7,8,9,10};
    int evens = count_if(v.begin(), v.end(), [](int x){ return x%2==0; });
    int gt5 = count_if(v.begin(), v.end(), [](int x){ return x>5; });
    cout << evens << " " << gt5;
}`,
output:'5 5',
explanation:'Evens in 1-10: {2,4,6,8,10}=5. Greater than 5: {6,7,8,9,10}=5.',
options:['5 5','4 5','5 4','Compile error'],answer:0},

{id:137,topic:'inherit',type:'theory',diff:'hard',q:'What is virtual base class initialization? What rule applies?',
answer_text:`In virtual inheritance, the MOST-DERIVED class is responsible for constructing the virtual base.

  class A { A(int x) { ... } };
  class B : virtual public A {
      B(): A(0) {}  // B provides init for A
  };
  class C : virtual public A {
      C(): A(0) {}  // C provides init for A
  };
  class D : public B, public C {
      D(): A(42), B(), C() {}  // D's init of A wins!
  };

When D is constructed:
  1. A(42) constructed first (D's initializer used)
  2. B() ΓÇö B's A(0) is IGNORED because A is a virtual base
  3. C() ΓÇö C's A(0) is IGNORED
  4. D()

This ensures A is constructed ONCE with D's arguments.
If D doesn't provide A's initializer ΓåÆ A's default constructor used.
This is why virtual base classes should have default constructors if possible.`,
options:['Each derived class constructs virtual base independently','Most-derived class constructs virtual base; intermediate classes\' initializers for virtual base are ignored ΓÇö ensure most-derived provides correct args','Virtual bases have no constructors','Virtual base is constructed last'],answer:1},

{id:138,topic:'oop',type:'output',diff:'medium',q:'What prints? (const correctness chain)',
code:`class Container {
    vector<int> data;
public:
    Container(initializer_list<int> il): data(il) {}
    int& at(int i) { cout << "nc "; return data[i]; }
    const int& at(int i) const { cout << "c "; return data[i]; }
};
int main() {
    Container c{1,2,3};
    const Container cc{4,5,6};
    c.at(0) = 10;
    cout << cc.at(1);
}`,
output:'nc c 5',
explanation:'c.at(0): non-const Container ΓåÆ non-const at() ΓåÆ "nc", returns reference, assigned 10. cc.at(1): const Container ΓåÆ const at() ΓåÆ "c", returns const ref 5.',
options:['nc c 5','c nc 5','nc c 2','Compile error'],answer:0},

{id:139,topic:'template',type:'output',diff:'hard',q:'What prints? (template specialization for char*)',
code:`template<typename T>
bool isEqual(T a, T b) { return a == b; }

template<>
bool isEqual(const char* a, const char* b) {
    return strcmp(a, b) == 0;
}
int main() {
    cout << isEqual(1, 1) << " ";
    cout << isEqual(1, 2) << " ";
    cout << isEqual("abc", "abc");
}`,
output:'1 0 1',
explanation:'isEqual(1,1): int==int ΓåÆ trueΓåÆ1. isEqual(1,2): falseΓåÆ0. isEqual("abc","abc"): specialization uses strcmp ΓåÆ 0==0 ΓåÆ trueΓåÆ1.',
options:['1 0 1','1 0 0','Compile error','1 1 1'],answer:0},

{id:140,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::for_each with capture)',
code:`#include <algorithm>
#include <vector>
int main() {
    vector<int> v = {1,2,3,4,5};
    int total = 0;
    for_each(v.begin(), v.end(), [&total](int x){ total += x; });
    cout << total;
}`,
output:'15',
explanation:'for_each applies lambda to each element. [&total] captures total by reference. Accumulates 1+2+3+4+5=15.',
options:['0','15','Compile error','5'],answer:1},

{id:141,topic:'oop',type:'theory',diff:'hard',q:'Explain the Strategy pattern using polymorphism and function objects.',
answer_text:`Strategy: defines a family of algorithms, encapsulates each, and makes them interchangeable.

Using polymorphism (classic):
  class SortStrategy {
  public:
      virtual void sort(vector<int>&) = 0;
      virtual ~SortStrategy() = default;
  };
  class QuickSort : public SortStrategy {
      void sort(vector<int>& v) override { /* quicksort */ }
  };
  class MergeSort : public SortStrategy {
      void sort(vector<int>& v) override { /* mergesort */ }
  };
  class Sorter {
      unique_ptr<SortStrategy> strategy;
  public:
      Sorter(unique_ptr<SortStrategy> s): strategy(move(s)) {}
      void doSort(vector<int>& v) { strategy->sort(v); }
  };

Modern C++ with std::function (more flexible):
  class Sorter {
      function<void(vector<int>&)> strategy;
  public:
      Sorter(function<void(vector<int>&)> s): strategy(s) {}
      void doSort(vector<int>& v) { strategy(v); }
  };
  Sorter s([](auto& v){ sort(v.begin(),v.end()); }); // lambda strategy`,
options:['Strategy requires multiple inheritance','Strategy encapsulates interchangeable algorithms ΓÇö classic: virtual inheritance hierarchy; modern: std::function/lambda for zero-cost type-erased strategies','Strategy is same as Template Method','Strategy uses static polymorphism only'],answer:1},

{id:142,topic:'poly',type:'output',diff:'hard',q:'What prints? (dynamic_cast failure)',
code:`class Base { public: virtual ~Base(){} };
class D1 : public Base {};
class D2 : public Base {};
int main() {
    Base* p = new D1();
    D2* q = dynamic_cast<D2*>(p);
    cout << (q == nullptr) << " ";
    try {
        D2& r = dynamic_cast<D2&>(*p);
    }
    catch(bad_cast&) { cout << "bad_cast"; }
}`,
output:'1 bad_cast',
explanation:'dynamic_cast<D2*>(p): p points to D1, not D2 ΓåÆ returns nullptr ΓåÆ prints 1. dynamic_cast<D2&>: fails with reference ΓåÆ throws bad_cast.',
options:['0 bad_cast','1 bad_cast','Compile error','1 '],answer:1},

{id:143,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::set with custom comparator)',
code:`#include <set>
struct CmpLen {
    bool operator()(const string& a, const string& b) const {
        return a.length() < b.length();
    }
};
int main() {
    set<string, CmpLen> s;
    s.insert("abc"); s.insert("de"); s.insert("f");
    for(auto& x : s) cout << x << " ";
}`,
output:'f de abc ',
explanation:'set sorted by string length (ascending). "f"(1) < "de"(2) < "abc"(3).',
options:['abc de f ','f de abc ','de f abc ','Compile error'],answer:1},

{id:144,topic:'oop',type:'output',diff:'medium',q:'What prints? (nullptr vs NULL vs 0)',
code:`void f(int x)   { cout << "int"; }
void f(int* p)  { cout << "ptr"; }
void f(nullptr_t){ cout << "null"; }
int main() {
    f(0);
    f(NULL);      // implementation-defined but usually 0
    f(nullptr);
}`,
output:'intintnull',
explanation:'0 and NULL (typically 0) both call f(int). nullptr has type nullptr_t ΓåÆ f(nullptr_t). nullptr is the proper null pointer literal.',
options:['intintnull','ptrintrnull','nullnullnull','Compile error'],answer:0},

{id:145,topic:'template',type:'theory',diff:'hard',q:'What are variadic templates and parameter packs? List three use cases.',
answer_text:`Variadic templates: templates accepting any number of type arguments.
  template<typename... Args> class Tuple { ... };
  template<typename... Args> void print(Args... args) { ... };

Parameter pack operations:
  sizeof...(Args)       ΓÇö number of types
  (func(args), ...)     ΓÇö fold expression to apply func to each
  forward<Args>(args)...ΓÇö perfect forward each

Use case 1 ΓÇö std::tuple implementation:
  template<typename... Ts>
  class tuple { /* recursive inheritance or array of any */ };

Use case 2 ΓÇö perfect forwarding factory:
  template<typename T, typename... Args>
  unique_ptr<T> make_unique(Args&&... args) {
      return unique_ptr<T>(new T(forward<Args>(args)...));
  }

Use case 3 ΓÇö printf-safe variadic print:
  template<typename... Args>
  void safeLog(string_view fmt, Args... args) {
      // C++20: format string checking at compile time
  }

Use case 4 ΓÇö std::visit with overloaded lambdas:
  template<typename... Ts>
  struct overloaded : Ts... { using Ts::operator()...; };`,
options:['Only for printf-style functions','Templates accepting any number of types ΓÇö used for tuple, perfect forwarding (make_unique/emplace), type-safe variadic print, overloaded lambdas','Variadic templates are runtime only','Limited to 10 arguments'],answer:1},

{id:146,topic:'inherit',type:'output',diff:'hard',q:'What prints? (covariant return + virtual chain)',
code:`struct Animal {
    virtual Animal* create() { cout << "A"; return new Animal(); }
};
struct Dog : Animal {
    Dog* create() override { cout << "D"; return new Dog(); }
};
struct GoldenRetriever : Dog {
    GoldenRetriever* create() override { cout << "G"; return new GoldenRetriever(); }
};
int main() {
    Animal* p = new GoldenRetriever();
    Animal* c = p->create();
}`,
output:'G',
explanation:'Covariant return: GoldenRetriever* overrides Dog* which overrides Animal*. Virtual dispatch to GoldenRetriever::create() ΓåÆ "G".',
options:['A','D','G','ADG'],answer:2},

{id:147,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::deque vs vector push_front)',
code:`#include <deque>
#include <vector>
int main() {
    deque<int> dq;
    dq.push_back(3); dq.push_front(2); dq.push_front(1);
    for(int x : dq) cout << x << " ";
    cout << "| ";
    cout << dq.front() << " " << dq.back();
}`,
output:'1 2 3 | 1 3',
explanation:'push_back(3)ΓåÆ{3}. push_front(2)ΓåÆ{2,3}. push_front(1)ΓåÆ{1,2,3}. front=1, back=3.',
options:['3 2 1 | 3 1','1 2 3 | 1 3','Compile error','2 3 1 | 2 1'],answer:1},

{id:148,topic:'oop',type:'theory',diff:'medium',q:'What are copy elision and guaranteed copy elision in C++17?',
answer_text:`Copy elision: optimization where compiler omits copy/move constructor calls.

Before C++17 (optional elision):
  Widget w = Widget();  // compiler MAY elide temporary copy
  return Widget();      // RVO: compiler MAY elide named/unnamed return

C++17 guaranteed copy elision (prvalue context):
  Widget w = Widget();  // GUARANTEED: no copy/move even if deleted!
  return Widget{};      // GUARANTEED for prvalue returns

Technical reason (C++17): prvalues are not objects ΓÇö they're instructions to initialize.
A prvalue Widget() doesn't create a temporary; it initializes the target directly.

What's NOT guaranteed:
  Widget w;
  return w;  // NRVO: not guaranteed, but common
  return move(w);  // forces move (prevents NRVO ΓÇö avoid move() in returns!)

Key rule: NEVER write return move(local_var) ΓÇö it prevents NRVO and forces a move instead of elision.`,
options:['Copy elision is a runtime optimization','Compiler omits copy/move calls; C++17 guarantees elision for prvalue init ΓÇö no copy even with deleted copy constructor; never return move(local)','Copy elision only for primitive types','Always requires noexcept'],answer:1},

{id:149,topic:'stl',type:'output',diff:'medium',q:'What prints? (std::string operations)',
code:`int main() {
    string s = "Hello, World!";
    cout << s.substr(7, 5) << " ";
    cout << s.find("World") << " ";
    s.replace(7, 5, "C++");
    cout << s;
}`,
output:'World 7 Hello, C++!',
explanation:'substr(7,5)="World". find("World")=7. replace(7,5,"C++") replaces 5 chars at pos 7 with "C++" ΓåÆ "Hello, C++!".',
options:['World 7 Hello, C++!','Hello 0 C++, World!','World 6 Hello, C++!','Compile error'],answer:0},

{id:150,topic:'poly',type:'theory',diff:'hard',q:'What is type erasure in C++? How does std::function implement it?',
answer_text:`Type erasure: hiding the concrete type while preserving behavior. Enables storing heterogeneous types through a uniform interface without virtual inheritance.

std::function<void(int)> can hold:
  ΓÇó Lambda
  ΓÇó Free function pointer
  ΓÇó Member function (with bind)
  ΓÇó Functor object
All with the same type!

Implementation technique:
  struct Concept { virtual void call(int) = 0; virtual ~Concept(){}; };
  
  template<typename F>
  struct Model : Concept {
      F func;
      Model(F f): func(f) {}
      void call(int x) override { func(x); }
  };
  
  class function {
      unique_ptr<Concept> impl;
  public:
      template<typename F>
      function(F f): impl(make_unique<Model<F>>(f)) {}
      void operator()(int x) { impl->call(x); }
  };

Small Buffer Optimization (SBO): small callables stored inline (no heap). Large ones heap-allocate.
Other type erasure examples: std::any, std::span, std::string_view, std::variant.`,
options:['Type erasure is just void*','Hiding concrete type while preserving behavior ΓÇö std::function uses internal virtual dispatch via concept/model pattern with SBO for small callables','Only for function pointers','Type erasure is runtime RTTI'],answer:1},

{id:151,topic:'oop',type:'output',diff:'hard',q:'What prints? (volatile keyword)',
code:`int main() {
    volatile int x = 0;
    for(int i = 0; i < 3; i++) {
        x++;
    }
    cout << x;
}`,
output:'3',
explanation:'volatile tells compiler not to optimize away reads/writes to x (assume it can change externally). Loop runs 3 times incrementing x to 3.',
options:['0','3','Undefined','Compile error'],answer:1},

{id:152,topic:'template',type:'output',diff:'hard',q:'What prints? (template with requires clause C++20)',
code:`template<typename T>
requires requires(T a, T b) { a + b; a < b; }
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}
int main() {
    cout << maxOf(3, 7) << " ";
    cout << maxOf(string("abc"), string("xyz"));
}`,
output:'7 xyz',
explanation:'requires requires(...) is an ad-hoc concept checking T supports + and <. int and string both satisfy it. maxOf correctly picks larger.',
options:['7 xyz','3 abc','Compile error','7 abc'],answer:0},

{id:153,topic:'stl',type:'output',diff:'hard',q:'What prints? (std::ranges::sort C++20)',
code:`#include <ranges>
#include <vector>
int main() {
    vector<int> v = {5,3,1,4,2};
    ranges::sort(v);
    ranges::for_each(v, [](int x){ cout << x << " "; });
    auto even = v | views::filter([](int x){ return x%2==0; });
    for(int x : even) cout << x << " ";
}`,
output:'1 2 3 4 5 2 4 ',
explanation:'ranges::sort sorts to {1,2,3,4,5}. ranges::for_each prints all. views::filter creates lazy view of evens {2,4}.',
options:['1 2 3 4 5 2 4 ','5 3 1 4 2 1 3 5','Compile error','1 2 3 4 5 2 4 6'],answer:0},

{id:154,topic:'inherit',type:'theory',diff:'hard',q:'What is the ABC (Abstract Base Class) pattern and how does it differ from interface?',
answer_text:`Abstract Base Class (ABC): a class with at least one pure virtual function.
Cannot be instantiated directly. Provides partial implementation + interface.

  class Shape {
  public:
      // Interface (pure virtual):
      virtual double area() const = 0;
      virtual double perimeter() const = 0;
      
      // Common implementation (non-pure):
      void describe() const {
          cout << "Area=" << area() << " Perimeter=" << perimeter();
      }
      
      virtual ~Shape() = default;
  };

Interface (fully abstract, no implementation):
  class IDrawable {
  public:
      virtual void draw() const = 0;
      virtual ~IDrawable() = default;
      // NO DATA MEMBERS, NO IMPLEMENTATION
  };

Difference:
  ΓÇó ABC: partial implementation + abstract methods (Template Method structure)
  ΓÇó Interface: pure abstraction, no implementation, no state (Java-style)

C++ has no interface keyword ΓÇö use class with all pure virtuals + virtual destructor.
Best practice for interfaces: no data members, all pure virtual, virtual/default destructor.`,
options:['ABC and interface are identical','ABC has partial implementation + pure virtuals (can have state); interface is purely abstract (all pure virtual, no state) ΓÇö C++ uses classes with all pure virtuals for interfaces','ABC cannot be inherited','Interfaces require multiple inheritance'],answer:1},

{id:155,topic:'stl',type:'output',diff:'hard',q:'What prints? (structured binding with get<>)',
code:`#include <tuple>
#include <array>
int main() {
    // Array decomposition
    array<int,3> a = {10,20,30};
    auto [x,y,z] = a;
    cout << x << " " << y << " " << z << " | ";
    
    // Tuple decomposition
    auto t = make_tuple(1, 2.5, string("hi"));
    auto& [a2,b2,c2] = t;
    b2 = 9.9;
    cout << get<1>(t);
}`,
output:'10 20 30 | 9.9',
explanation:'Array decomposed: x=10,y=20,z=30. Tuple decomposed by reference: a2,b2,c2 are refs into t. Modifying b2=9.9 changes t\'s second element.',
options:['10 20 30 | 9.9','10 20 30 | 2.5','Compile error','10 20 30 | 9'],answer:0},
];

// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
//  TOPIC SUMMARIES
// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
const SUMMARIES = {
  oop: {title:"OOP Core",color:"#7c3aed",points:[
    "Constructors run BaseΓåÆDerived; Destructors reverse: ~DerivedΓåÆ~Base",
    "Copy ctor by default = shallow copy: pointer values only, NOT heap data ΓåÆ Rule of Three/Five",
    "Member initialization order = DECLARATION order, not initializer list order",
    "Static members shared across all instances; initialized once outside class",
    "explicit keyword prevents implicit single-arg constructor conversions",
    "mutable allows const method to modify member (for caching, mutex)",
    "move semantics: T&& rvalue ref; std::move casts to rvalue; move ctor steals resources",
    "PIMPL: pointer to impl ΓÇö reduces compile dependencies, provides ABI stability",
    "RAII: acquire in ctor, release in dtor ΓÇö smart pointers, fstream, lock_guard",
    "Copy-and-swap idiom: strong exception safety for operator=",
    "SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
  ]},
  inherit: {title:"Inheritance",color:"#00d4ff",points:[
    "public=is-a, protected=implementation only, private=has-a via inheritance",
    "Virtual destructor required when deleting via base pointer ΓåÆ otherwise UB",
    "Object slicing: passing Derived by value as Base loses derived part",
    "Diamond problem: DΓåÆB,CΓåÆA creates two A copies. Fix: virtual inheritance",
    "Virtual base: most-derived class constructs it; intermediate inits ignored",
    "using Base::method brings hidden base method into derived scope",
    "Liskov Substitution: derived must be fully substitutable for base",
    "Fragile base: changing base impl can break derived ΓÇö prefer composition",
    "Inherit constructors: using Base::Base; brings all base ctors to derived",
    "Multiple inheritance: C:A,B ΓÇö bases constructed in declaration order",
  ]},
  poly: {title:"Polymorphism",color:"#f59e0b",points:[
    "Virtual dispatch: vtable lookup at runtime based on actual object type",
    "vtable: per-class array of function pointers. vptr: per-object 8B pointer",
    "Two extra memory reads + no inlining per virtual call ΓÇö avoid in tight loops",
    "override keyword: catches signature mismatch at compile time ΓÇö always use it",
    "final: prevents further overriding. Can also apply to entire class",
    "Pure virtual (=0): makes class abstract. Can still have implementation body",
    "Covariant return: derived can return Derived* where base returns Base*",
    "CRTP: static polymorphism with zero vtable overhead via template recursion",
    "NVI (Non-Virtual Interface): public non-virtual ΓåÆ private virtual",
    "virtual function in constructor: static dispatch (vtable not fully set up yet!)",
    "Default args resolved at COMPILE TIME by pointer type ΓÇö NOT runtime type!",
  ]},
  template: {title:"Templates",color:"#10b981",points:[
    "Function templates: compiler deduces T from args; explicit: func<int>()",
    "Class template full specialization: template<> class Foo<int> {}",
    "Partial specialization: template<typename T> class Foo<T*> {} ΓÇö only for classes",
    "Non-type template params: template<int N> ΓÇö compile-time constants",
    "Variadic templates: Args... parameter pack. sizeof...(Args) for count",
    "SFINAE: substitution failure is not an error ΓÇö silently discards bad overloads",
    "enable_if<condition>: enables/disables overload based on type trait",
    "if constexpr: compile-time branch ΓÇö only matching branch is compiled",
    "Fold expressions (C++17): (... + args) expands to (((a+b)+c)+d)",
    "Concepts (C++20): named constraints, cleaner than SFINAE, better errors",
    "CRTP: Derived passes self as template arg to Base for static polymorphism",
    "TMP: template metaprogramming ΓÇö Turing complete, compile-time computation",
    "CTAD (C++17): class template argument deduction from constructor",
  ]},
  stl: {title:"STL",color:"#ef4444",points:[
    "vector: contiguous, O(1) amortized pushback, reallocation invalidates ALL iters",
    "list: doubly-linked, O(1) insert anywhere with iter, poor cache performance",
    "deque: O(1) push_front AND push_back, segmented memory",
    "map: red-black tree, sorted O(log n). unordered_map: hash O(1) avg",
    "set: unique sorted elements. unordered_set: hash set unique elements",
    "priority_queue: max-heap by default. Use greater<> for min-heap",
    "Iterator invalidation: vector realloc=all invalid. list/map=only erased iter invalid",
    "map operator[] inserts default value if key not found ΓÇö use find() to avoid",
    "sort: O(n log n) unstable. stable_sort: stable. partial_sort: top-k O(n log k)",
    "Algorithm range: [first, last) ΓÇö last is one past end, never dereferenced",
    "lower_bound/upper_bound: O(log n) on sorted range ΓÇö binary search iterators",
    "std::function: type erasure for callables. std::variant: type-safe union",
    "std::optional: value-or-nothing. std::span: non-owning contiguous view",
    "Lambdas: [=] copy all, [&] ref all, [x] copy x, [&x] ref x. mutable for copy modification",
  ]},
  exception: {title:"Exception Handling",color:"#fbbf24",points:[
    "try-catch: exception propagates up until matching handler found",
    "catch order matters: put most-derived exceptions FIRST",
    "catch(...): catches everything including non-standard exceptions",
    "throw; (no argument): re-throws current exception unchanged",
    "RAII ensures cleanup on exception: destructors called during stack unwinding",
    "Destructor throwing during stack unwinding ΓåÆ terminate() ΓÇö keep dtors noexcept",
    "noexcept: guarantee function won't throw. Violation ΓåÆ terminate()",
    "noexcept enables vector to use move semantics; without it vector may copy",
    "Exception safety: no-guarantee < basic < strong < no-throw",
    "Function-try-block: only way to catch constructor initializer list exceptions",
    "Custom exceptions: inherit from std::exception, override what()",
    "Catch base class by reference to preserve virtual dispatch (polymorphic exceptions)",
  ]},
  file: {title:"File Handling",color:"#6366f1",points:[
    "ifstream: read. ofstream: write. fstream: read+write",
    "Always check stream state: if(!fin) or fin.fail()",
    "Text mode: \\n translated. Binary mode (ios::binary): byte-exact",
    "RAII: file auto-closed when stream object destroyed ΓÇö no manual close needed",
    "seekg/seekp: move read/write position. tellg/tellp: get current position",
    "ios::beg, ios::cur, ios::end: seek directions",
    "write()/read(): binary block I/O. reinterpret_cast<char*>(&obj) for structs",
    "getline(fin, str): reads whole line including spaces",
    "fin >> x: skips whitespace, reads token",
    "No mid-file insertion without reading/shifting everything after insertion point",
  ]},
};

// QUIZ QUESTIONS for test series (30 MCQ)
const QUIZ_QS = [
  {q:"Constructor execution order for class D : B, A (in that declaration order)?",opts:["DΓåÆBΓåÆA","BΓåÆAΓåÆD","AΓåÆBΓåÆD","DΓåÆAΓåÆB"],ans:1,exp:"Bases constructed in DECLARATION ORDER (B then A), then derived D."},
  {q:"With virtual inheritance, who is responsible for constructing the virtual base?",opts:["First intermediate class","Last intermediate class","Most-derived class","Shared responsibility"],ans:2,exp:"Most-derived class constructs the virtual base. Intermediate initializers are ignored."},
  {q:"What is object slicing?",opts:["Pointer arithmetic on objects","Losing derived data when passing derived by value as base","Copying array elements","Splitting class into files"],ans:1,exp:"Passing derived object by value as base type ΓÇö loses all derived-class members."},
  {q:"Default args in virtual functions are resolved based on:",opts:["Dynamic (runtime) type","Static (compile-time/pointer) type","The overriding class","Random"],ans:1,exp:"Default args are compile-time construct, resolved by STATIC type of pointer/reference. Tricky!"},
  {q:"Which correctly describes SFINAE?",opts:["Syntax Feature In Name Applications Error","Substitution Failure Is Not An Error","Single Function Instance Not An Error","None"],ans:1,exp:"Substitution Failure Is Not An Error ΓÇö invalid template substitution silently drops overload."},
  {q:"map operator[] when key does NOT exist:",opts:["Throws exception","Returns -1","Default-inserts key with zero value","Returns end()"],ans:2,exp:"operator[] default-inserts missing key with value-initialized value. Use find() to check without inserting."},
  {q:"What does 'throw;' (no argument) do?",opts:["Throws nullptr","Throws default exception","Re-throws current active exception unchanged","Terminates program"],ans:2,exp:"Bare throw; re-throws the current exception. Preserves original type and state."},
  {q:"Vector iterator validity after push_back causing reallocation:",opts:["All iterators still valid","Only end() invalidated","All iterators, pointers, references invalidated","Only begin() invalidated"],ans:2,exp:"Reallocation copies to new memory ΓÇö ALL iterators, pointers, and references are invalidated."},
  {q:"CRTP stands for:",opts:["Compile-time Runtime Template Pattern","Curiously Recurring Template Pattern","Class Recursive Type Parameter","None"],ans:1,exp:"Curiously Recurring Template Pattern ΓÇö derived passes itself as template arg to base for static polymorphism."},
  {q:"noexcept violation causes:",opts:["Exception to propagate normally","Undefined behavior","std::terminate() to be called","Program to pause"],ans:2,exp:"Throwing from noexcept function calls std::terminate() immediately."},
  {q:"What does priority_queue<int> provide by default?",opts:["Min-heap","Max-heap","Sorted queue","FIFO queue"],ans:1,exp:"Default priority_queue is max-heap ΓÇö top() returns largest element."},
  {q:"Rule of Five in C++11 adds which two to Rule of Three?",opts:["Move ctor and move assignment","Virtual ctor and virtual dtor","Copy ctor and copy assignment","Static methods"],ans:0,exp:"Rule of Five adds move constructor and move assignment operator to the three from C++03."},
  {q:"'explicit' keyword on constructor prevents:",opts:["Inheritance","Virtual overriding","Implicit single-argument conversions","Multiple constructors"],ans:2,exp:"explicit prevents implicit conversion/copy-initialization using that constructor."},
  {q:"lower_bound() requires the range to be:",opts:["Any order","Sorted (ascending by default)","Unique elements only","Non-empty"],ans:1,exp:"lower_bound uses binary search ΓÇö requires sorted range. Returns iterator to first element >= value."},
  {q:"In virtual inheritance, construction order for W : Y, Z (both Y,Z : virtual X):",opts:["X Y Z W","Y Z X W","W Y Z X","Z Y X W"],ans:0,exp:"Virtual base X constructed first, then bases in declaration order (Y, Z), then W."},
  {q:"What does std::unique() do to a container?",opts:["Removes all duplicates and resizes","Moves consecutive duplicates to end, returns new logical end","Sorts unique elements","Counts unique elements"],ans:1,exp:"unique() only removes CONSECUTIVE duplicates. Sort first if needed. Must erase() the tail separately."},
  {q:"Member initialization in initializer list order is determined by:",opts:["Order in initializer list","Order of base class constructors","Declaration order in class body","Alphabetical order"],ans:2,exp:"Members are always initialized in their DECLARATION ORDER in the class body, regardless of initializer list order."},
  {q:"std::optional<T>'s value() throws what if empty?",opts:["std::runtime_error","std::bad_optional_access","std::bad_alloc","Nothing ΓÇö returns default T"],ans:1,exp:"Calling value() on empty optional throws std::bad_optional_access. Use value_or() to provide default."},
  {q:"Which cast is used for safe polymorphic downcasting?",opts:["static_cast","reinterpret_cast","dynamic_cast","const_cast"],ans:2,exp:"dynamic_cast performs runtime type checking ΓÇö returns nullptr (ptr) or throws bad_cast (ref) on failure."},
  {q:"fold expression (... + args) is which type of fold?",opts:["Right fold","Left fold","Binary fold","None"],ans:1,exp:"(... op pack) is unary left fold: ((pack1 op pack2) op pack3)..."},
  {q:"if constexpr differs from if in that:",opts:["It runs at runtime","The non-matching branch is not compiled (only syntactically checked)","It requires templates","It prevents exceptions"],ans:1,exp:"if constexpr discards non-matching branches at compile time ΓÇö they don't need to be valid code for that instantiation."},
  {q:"What is the vtable overhead per object?",opts:["0 bytes","4 bytes","8 bytes (on 64-bit)","Size of vtable"],ans:2,exp:"vptr = 1 pointer = 8 bytes on 64-bit systems. One per object with virtual functions."},
  {q:"std::string_view vs std::string:",opts:["string_view owns data","string_view is a non-owning view, string owns data","They are identical","string_view is mutable"],ans:1,exp:"string_view is a non-owning view (pointer + length). Faster to pass than string but doesn't own data."},
  {q:"catch(Base& b) before catch(Derived& d) ΓÇö what happens when Derived thrown?",opts:["Derived handler matches","Base handler matches (first match wins)","Both handlers run","Compile error"],ans:1,exp:"catch handlers checked in ORDER ΓÇö Base& matches Derived (is-a). Put derived first! Base handler fires."},
  {q:"std::variant vs C union:",opts:["Identical in behavior","variant is type-safe, tracks active member, destructs properly","Union is always safer","variant requires heap allocation"],ans:1,exp:"variant tracks which type is active, properly destructs it, and throws bad_variant_access on wrong access. C union is unsafe."},
  {q:"PIMPL (Pointer to Implementation) primary benefit:",opts:["Faster virtual dispatch","Compilation firewall ΓÇö reduces rebuild when implementation changes","Enables multiple inheritance","Replaces virtual functions"],ans:1,exp:"PIMPL hides implementation in .cpp; changing Impl doesn't recompile users of the header. ABI stability."},
  {q:"What does structured binding auto [x,y] = pair{1,2} do?",opts:["Creates a tuple","Binds x to first, y to second element of the pair","Copies the pair","Requires C++20"],ans:1,exp:"Structured bindings (C++17) decompose aggregates, pairs, tuples, arrays into named variables."},
  {q:"std::function<void(int)> can store:",opts:["Only function pointers","Only lambdas","Any callable: lambda, functor, bind result, function pointer","Only member functions"],ans:2,exp:"std::function uses type erasure to store any callable with matching signature."},
  {q:"Guaranteed copy elision in C++17 applies to:",opts:["Named local variables returned","All return statements","Prvalue initialization (return T{}, T w = T{})","Only with -O2"],ans:2,exp:"C++17 guarantees elision for prvalues. NRVO (named variable return) is still optional."},
  {q:"What is the NVI (Non-Virtual Interface) pattern?",opts:["Non-virtual classes only","Public non-virtual functions call private virtual functions ΓÇö base controls pre/post","Virtual functions must be non-public","Same as CRTP"],ans:1,exp:"NVI: public non-virtual interface calls private virtual customization points. Base maintains invariants."},
];

// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
//  MAIN APP
// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
export default function App() {
  const [tab, setTab] = useState("practice");
  const [filter, setFilter] = useState("all");
  const [openQ, setOpenQ] = useState(null);
  const [summaryTopic, setSummaryTopic] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState(new Set());

  const topics = ["all","oop","inherit","poly","template","stl","exception","file"];
  const topicLabels = {all:"All",oop:"OOP Core",inherit:"Inheritance",poly:"Polymorphism",template:"Templates",stl:"STL",exception:"Exceptions",file:"File I/O"};
  const topicColors = {oop:"#7c3aed",inherit:"#00d4ff",poly:"#f59e0b",template:"#10b981",stl:"#ef4444",exception:"#fbbf24",file:"#6366f1"};

  const filtered = QUESTIONS.filter(q => {
    const topicOk = filter === "all" || q.topic === filter;
    const searchOk = !searchTerm || q.q.toLowerCase().includes(searchTerm.toLowerCase());
    return topicOk && searchOk;
  });

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",color:"#e2e8f0",fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative"}}>
      {/* BG */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 80% 50% at 20% 10%,rgba(124,58,237,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 90%,rgba(0,212,255,0.05) 0%,transparent 60%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(10,14,26,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid #1e2d4a",padding:"0 24px",display:"flex",alignItems:"center",height:56,gap:8}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.1rem",fontWeight:700,color:"#00d4ff",marginRight:16}}>C++<span style={{color:"#e2e8f0"}}> OOP</span></div>
        {[["practice","≡ƒôÜ Practice"],["summaries","≡ƒôû Summaries"],["test","≡ƒÄ» Tests"],["ai","≡ƒñû AI Tutor"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?"rgba(0,212,255,0.1)":"none",border:"none",borderBottom:tab===id?"2px solid #00d4ff":"2px solid transparent",color:tab===id?"#00d4ff":"#64748b",fontFamily:"inherit",fontSize:"0.75rem",fontWeight:600,padding:"0 14px",height:"100%",cursor:"pointer",letterSpacing:"0.05em",textTransform:"uppercase",transition:"all 0.2s"}}>
            {label}
          </button>
        ))}
        <div style={{marginLeft:"auto",fontSize:"11px",color:"#64748b",fontFamily:"monospace"}}>
          {QUESTIONS.length} questions
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"28px 20px"}}>

        {/* ΓöÇΓöÇ PRACTICE TAB ΓöÇΓöÇ */}
        {tab==="practice" && (
          <>
            <div style={{marginBottom:20,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="≡ƒöì Search questions..." style={{background:"rgba(0,212,255,0.04)",border:"1px solid #1e2d4a",borderRadius:8,padding:"8px 14px",color:"#e2e8f0",fontFamily:"inherit",fontSize:13,outline:"none",minWidth:200,flex:1}}/>
              <span style={{fontSize:12,color:"#64748b",fontFamily:"monospace",whiteSpace:"nowrap"}}>{filtered.length} shown</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
              {topics.map(t=>(
                <button key={t} onClick={()=>setFilter(t)} style={{background:filter===t?"rgba(0,212,255,0.12)":"#0f1629",border:filter===t?"1px solid #00d4ff":"1px solid #1e2d4a",color:filter===t?"#00d4ff":"#64748b",fontFamily:"inherit",fontSize:"0.7rem",fontWeight:600,padding:"5px 12px",borderRadius:20,cursor:"pointer",transition:"all 0.18s",textTransform:"uppercase",letterSpacing:"0.05em"}}>
                  {topicLabels[t]} {t!=="all"&&<span style={{opacity:0.6}}>({QUESTIONS.filter(q=>q.topic===t).length})</span>}
                </button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {filtered.map((q,i)=>{
                const isOpen = openQ===q.id;
                const isBookmarked = bookmarks.has(q.id);
                const tc = topicColors[q.topic]||"#00d4ff";
                return (
                  <div key={q.id} style={{background:"#0f1629",border:`1px solid ${isOpen?"rgba(0,212,255,0.35)":"#1e2d4a"}`,borderRadius:12,overflow:"hidden",transition:"all 0.2s",boxShadow:isOpen?"0 0 20px rgba(0,212,255,0.1)":"none"}}>
                    <div onClick={()=>setOpenQ(isOpen?null:q.id)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",cursor:"pointer"}}>
                      <span style={{fontFamily:"monospace",fontSize:"0.68rem",color:"#64748b",minWidth:30,paddingTop:2}}>#{q.id}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:7}}>
                          <span style={{fontSize:"0.6rem",fontWeight:700,padding:"2px 7px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.06em",background:`${tc}18`,color:tc,border:`1px solid ${tc}30`}}>{topicLabels[q.topic]}</span>
                          <span style={{fontSize:"0.6rem",fontWeight:700,padding:"2px 7px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.06em",background:q.type==="output"?"rgba(16,185,129,0.1)":"rgba(236,72,153,0.1)",color:q.type==="output"?"#6ee7b7":"#f9a8d4",border:`1px solid ${q.type==="output"?"rgba(16,185,129,0.2)":"rgba(236,72,153,0.2)"}`}}>{q.type==="output"?"ΓÜÖ Output":"≡ƒôû Theory"}</span>
                          <span style={{fontSize:"0.6rem",fontWeight:700,padding:"2px 7px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.06em",background:q.diff==="hard"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",color:q.diff==="hard"?"#f87171":"#fbbf24",border:`1px solid ${q.diff==="hard"?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)"}`}}>{q.diff==="hard"?"≡ƒö┤ Hard":"≡ƒƒí Medium"}</span>
                        </div>
                        <div style={{fontSize:"0.9rem",fontWeight:600,lineHeight:1.5,color:"#e2e8f0"}}>{q.q}</div>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                        <button onClick={e=>{e.stopPropagation();setBookmarks(b=>{const n=new Set(b);n.has(q.id)?n.delete(q.id):n.add(q.id);return n;})}} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:isBookmarked?1:0.3,color:"#f59e0b"}}>Γÿà</button>
                        <span style={{color:"#64748b",transition:"transform 0.3s",transform:isOpen?"rotate(180deg)":"none",fontSize:12}}>Γû╝</span>
                      </div>
                    </div>
                    {isOpen&&(
                      <div style={{padding:"0 18px 18px 60px",borderTop:"1px solid #1e2d4a",paddingTop:16}}>
                        {q.code&&<pre style={{background:"#060d1f",border:"1px solid #1e2d4a",borderRadius:8,padding:14,fontFamily:"'JetBrains Mono',Consolas,monospace",fontSize:"0.75rem",lineHeight:1.6,overflowX:"auto",margin:"0 0 12px 0",color:"#e2e8f0"}} dangerouslySetInnerHTML={{__html:q.code}}/>}
                        {q.type==="output"&&(
                          <div style={{background:"rgba(0,212,255,0.05)",border:"1px solid rgba(0,212,255,0.15)",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
                            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#00d4ff",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Expected Output</div>
                            <div style={{fontFamily:"monospace",fontSize:"0.9rem",color:"#00d4ff"}}>{q.output}</div>
                          </div>
                        )}
                        <div style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.18)",borderRadius:8,padding:"12px 14px"}}>
                          <div style={{fontSize:"0.68rem",fontWeight:700,color:"#10b981",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Γ£ª Answer</div>
                          <div style={{fontSize:"0.84rem",color:"#94a3b8",lineHeight:1.75,whiteSpace:"pre-line"}}>{q.answer_text||q.explanation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ΓöÇΓöÇ SUMMARIES TAB ΓöÇΓöÇ */}
        {tab==="summaries" && (
          <>
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",fontWeight:700,marginBottom:8}}>≡ƒôû Topic Summaries & Key Points</div>
              <div style={{color:"#64748b",fontSize:13}}>Comprehensive theory summaries for quick revision before your exam.</div>
            </div>
            {!summaryTopic ? (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                {Object.entries(SUMMARIES).map(([key,s])=>(
                  <button key={key} onClick={()=>setSummaryTopic(key)} style={{padding:22,borderRadius:14,background:"#0f1629",border:`1px solid rgba(0,212,255,0.1)`,cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#e2e8f0",transition:"all 0.25s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;e.currentTarget.style.boxShadow=`0 6px 24px ${s.color}18`;e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,212,255,0.1)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                    <div style={{fontWeight:700,fontSize:"1.05rem",color:s.color,marginBottom:8}}>{s.title}</div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:10}}>{s.points.length} key points</div>
                    <div style={{fontSize:11,color:s.color,opacity:0.7}}>View Summary ΓåÆ</div>
                  </button>
                ))}
              </div>
            ):(
              <div>
                <button onClick={()=>setSummaryTopic(null)} style={{background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.2)",color:"#00d4ff",padding:"7px 14px",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,marginBottom:20}}>ΓåÉ Back to Topics</button>
                <div style={{background:"#0f1629",border:`1px solid ${SUMMARIES[summaryTopic].color}30`,borderRadius:14,padding:28}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",fontWeight:700,color:SUMMARIES[summaryTopic].color,marginBottom:20}}>{SUMMARIES[summaryTopic].title} ΓÇö Key Points</div>
                  {SUMMARIES[summaryTopic].points.map((pt,i)=>(
                    <div key={i} style={{display:"flex",gap:12,marginBottom:14,padding:"12px 14px",borderRadius:9,background:"rgba(0,212,255,0.02)",border:"1px solid rgba(0,212,255,0.06)"}}>
                      <span style={{fontFamily:"monospace",fontSize:11,color:SUMMARIES[summaryTopic].color,minWidth:24,paddingTop:2,fontWeight:700}}>{String(i+1).padStart(2,"0")}</span>
                      <span style={{fontSize:"0.87rem",color:"#94a3b8",lineHeight:1.7}}>{pt}</span>
                    </div>
                  ))}
                  {/* Related questions */}
                  <div style={{marginTop:24,borderTop:"1px solid #1e2d4a",paddingTop:20}}>
                    <div style={{fontWeight:700,fontSize:"0.85rem",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Related Questions in Bank</div>
                    {QUESTIONS.filter(q=>q.topic===summaryTopic).slice(0,5).map(q=>(
                      <div key={q.id} style={{padding:"10px 14px",borderRadius:8,background:"rgba(0,0,0,0.3)",border:"1px solid #1e2d4a",marginBottom:8,fontSize:"0.83rem",color:"#7da8c4",cursor:"pointer"}}
                        onClick={()=>{setSummaryTopic(null);setTab("practice");setFilter(summaryTopic);setOpenQ(q.id);}}>
                        #{q.id}: {q.q.slice(0,80)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ΓöÇΓöÇ TEST TAB ΓöÇΓöÇ */}
        {tab==="test" && (
          <QuizSection questions={QUIZ_QS}/>
        )}

        {/* ΓöÇΓöÇ AI TAB ΓöÇΓöÇ */}
        {tab==="ai" && (
          <AITutor/>
        )}
      </div>
    </div>
  );
}

// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
//  QUIZ COMPONENT
// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
function QuizSection({questions}) {
  const [phase, setPhase] = useState("setup");
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const timerRef = useRef(null);
  const [numQ, setNumQ] = useState(15);
  const [timed, setTimed] = useState(true);

  const start = () => {
    const shuffled = [...questions].sort(()=>Math.random()-0.5).slice(0,numQ);
    setQs(shuffled); setCur(0); setSel(null); setAnswered(false);
    setScore(0); setLog([]); setTimeLeft(90); setPhase("quiz");
  };

  useEffect(()=>{
    if(phase!=="quiz"||answered||!timed) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);handleAns(-1);return 0;}
        return t-1;
      });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[phase,cur,answered]);

  const handleAns = (idx) => {
    clearInterval(timerRef.current);
    if(answered) return;
    setSel(idx); setAnswered(true);
    const ok = idx===qs[cur].ans;
    if(ok) setScore(s=>s+1);
    setLog(l=>[...l,{q:qs[cur],sel:idx,ok}]);
  };

  const next = () => {
    if(cur+1>=qs.length){setPhase("result");return;}
    setCur(c=>c+1); setSel(null); setAnswered(false); setTimeLeft(90);
  };

  if(phase==="setup") return (
    <div style={{maxWidth:560,margin:"0 auto"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",fontWeight:700,marginBottom:20}}>≡ƒÄ» C++ OOP Test Series</div>
      <div style={{background:"#0f1629",border:"1px solid #1e2d4a",borderRadius:14,padding:28,marginBottom:20}}>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Number of Questions</label>
          <div style={{display:"flex",gap:8}}>
            {[10,15,20,30].map(n=>(
              <button key={n} onClick={()=>setNumQ(n)} style={{padding:"8px 18px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",background:numQ===n?"rgba(0,212,255,0.12)":"transparent",color:numQ===n?"#00d4ff":"#64748b",border:`1px solid ${numQ===n?"#00d4ff":"#1e2d4a"}`}}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Timer (90s per question)</label>
          <div style={{display:"flex",gap:8}}>
            {[[true,"Timed ΓÅ▒"],[false,"Untimed"]].map(([v,l])=>(
              <button key={l} onClick={()=>setTimed(v)} style={{padding:"8px 18px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",background:timed===v?"rgba(0,212,255,0.12)":"transparent",color:timed===v?"#00d4ff":"#64748b",border:`1px solid ${timed===v?"#00d4ff":"#1e2d4a"}`}}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={start} style={{width:"100%",padding:"14px",borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#00d4ff)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"0.95rem",fontWeight:700,letterSpacing:"0.05em"}}>Start Test ΓåÆ</button>
      </div>
      <div style={{background:"#0f1629",border:"1px solid #1e2d4a",borderRadius:12,padding:18}}>
        <div style={{fontWeight:700,fontSize:"0.8rem",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Topics Covered</div>
        {["OOP Core (RAII, constructors, operators)","Inheritance (virtual, LSP, diamond)","Polymorphism (vtable, CRTP, dispatch)","Templates (SFINAE, variadic, concepts)","STL (containers, algorithms, lambdas)","Exception Handling (safety guarantees)"].map((t,i)=>(
          <div key={i} style={{fontSize:13,color:"#7da8c4",padding:"4px 0",borderBottom:"1px solid rgba(0,212,255,0.05)"}}>ΓÇó {t}</div>
        ))}
      </div>
    </div>
  );

  if(phase==="result") {
    const pct = Math.round(score/qs.length*100);
    const color = pct>=85?"#10b981":pct>=65?"#f59e0b":"#ef4444";
    return (
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{background:"#0f1629",border:"1px solid #1e2d4a",borderRadius:14,padding:36,textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:12}}>≡ƒÄô</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:"1.4rem",fontWeight:700,marginBottom:6}}>{pct>=85?"Outstanding! ≡ƒÅå":pct>=65?"Great Job! ≡ƒÄ»":"Keep Practicing ≡ƒôÜ"}</div>
          <div style={{fontFamily:"monospace",fontSize:"3.5rem",fontWeight:700,color,margin:"16px 0"}}>{pct}%</div>
          <div style={{display:"flex",gap:32,justifyContent:"center",marginBottom:24}}>
            {[[score,"Correct","#10b981"],[qs.length-score,"Wrong","#ef4444"],[qs.length,"Total","#00d4ff"]].map(([v,l,c])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"monospace",fontSize:"1.6rem",fontWeight:700,color:c}}>{v}</div><div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div></div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={start} style={{padding:"11px 24px",borderRadius:9,background:"linear-gradient(135deg,#7c3aed,#00d4ff)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>Try Again</button>
            <button onClick={()=>setPhase("setup")} style={{padding:"11px 24px",borderRadius:9,background:"transparent",color:"#00d4ff",border:"1px solid rgba(0,212,255,0.3)",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>Back</button>
          </div>
        </div>
        <div style={{fontWeight:700,fontSize:"0.85rem",color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Answer Review</div>
        {log.map((item,i)=>(
          <div key={i} style={{background:"#0f1629",border:`1px solid ${item.ok?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.15)"}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{item.ok?"Γ£à":"Γ¥î"} Q{i+1}: {item.q.q}</div>
            {!item.ok&&<div style={{fontSize:12,color:"#10b981",marginBottom:4}}>Γ£ô Correct: {item.q.opts[item.q.ans]}</div>}
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{item.q.exp}</div>
          </div>
        ))}
      </div>
    );
  }

  const q = qs[cur];
  const pct = (cur/qs.length*100).toFixed(0);
  return (
    <div style={{maxWidth:640,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{flex:1,maxWidth:320}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:5}}><span>Q{cur+1}/{qs.length}</span><span>{pct}%</span></div>
          <div style={{height:4,borderRadius:2,background:"#1e2d4a",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#7c3aed,#00d4ff)",borderRadius:2}}/></div>
        </div>
        {timed&&<div style={{fontFamily:"monospace",fontSize:"1.2rem",color:timeLeft<=20?"#ef4444":"#f59e0b",background:timeLeft<=20?"rgba(239,68,68,0.08)":"rgba(245,158,11,0.08)",border:`1px solid ${timeLeft<=20?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)"}`,padding:"7px 16px",borderRadius:7}}>0:{String(timeLeft).padStart(2,"0")}</div>}
      </div>
      <div style={{background:"#0f1629",border:"1px solid #1e2d4a",borderRadius:12,padding:26,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:"0.95rem",lineHeight:1.6,marginBottom:22}}>Q{cur+1}. {q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((opt,i)=>{
            let bg="rgba(0,212,255,0.02)",bc="#1e2d4a",col="#e2e8f0";
            if(answered){
              if(i===q.ans){bg="rgba(16,185,129,0.08)";bc="#10b981";col="#6ee7b7";}
              else if(i===sel&&i!==q.ans){bg="rgba(239,68,68,0.07)";bc="#ef4444";col="#f87171";}
            } else if(sel===i){bg="rgba(0,212,255,0.08)";bc="#00d4ff";col="#00d4ff";}
            return (
              <div key={i} onClick={()=>!answered&&handleAns(i)}
                style={{padding:"12px 16px",borderRadius:9,border:`1px solid ${bc}`,background:bg,color:col,cursor:answered?"default":"pointer",display:"flex",alignItems:"center",gap:12,fontSize:14,transition:"all 0.15s"}}>
                <span style={{width:24,height:24,borderRadius:5,background:"rgba(0,212,255,0.08)",border:"1px solid rgba(0,212,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:11,fontWeight:700,color:"#00d4ff",flexShrink:0}}>{String.fromCharCode(65+i)}</span>
                {opt}
              </div>
            );
          })}
        </div>
        {answered&&<div style={{marginTop:16,padding:"12px 14px",borderRadius:8,background:sel===q.ans?"rgba(16,185,129,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${sel===q.ans?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`}}>
          <span style={{fontWeight:700,color:sel===q.ans?"#10b981":"#ef4444"}}>{sel===q.ans?"Γ£à Correct!":"Γ¥î Wrong"}</span>
          <p style={{fontSize:13,color:"#64748b",marginTop:6,lineHeight:1.6}}>{q.exp}</p>
        </div>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <button onClick={()=>setPhase("setup")} style={{padding:"9px 18px",borderRadius:8,background:"transparent",color:"#64748b",border:"1px solid #1e2d4a",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>End</button>
        {answered&&<button onClick={next} style={{padding:"9px 22px",borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#00d4ff)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>{cur+1>=qs.length?"Results ΓåÆ":"Next ΓåÆ"}</button>}
      </div>
    </div>
  );
}

// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
//  AI TUTOR ΓÇö powered by Anthropic API
// ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ
function AITutor() {
  const [messages, setMessages] = useState([
    {role:"assistant",content:"≡ƒæï Hi! I'm your C++ OOP AI Tutor. Ask me **anything** about C++ OOP ΓÇö constructors, templates, STL, virtual functions, CRTP, SFINAE, exception safety, design patterns, code explanations, or anything else!\n\nTry: *\"Explain vtable with example\"* or *\"What is CRTP?\"* or *\"Show me a variadic template\"*"}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [suggestions] = useState([
    "Explain vtable and vptr with example",
    "What is CRTP and when to use it?",
    "Difference between move and copy semantics",
    "How does std::shared_ptr work internally?",
    "What is SFINAE? Show me enable_if example",
    "Explain exception safety guarantees",
    "What is the Rule of Five?",
    "How does std::function type erasure work?",
    "Show me diamond problem with solution",
    "Explain template metaprogramming with factorial",
  ]);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

  const send = async(msg) => {
    if(!msg.trim()||loading) return;
    const userMsg = {role:"user",content:msg};
    setMessages(m=>[...m,userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are an expert C++ OOP tutor. Answer questions about C++, OOP, templates, STL, design patterns, and related topics.

Rules:
- Be precise and technical but clear
- Use code examples when helpful (wrap in \`\`\`cpp ... \`\`\`)
- For code output questions, explain WHY step by step
- Mention C++ standard version when relevant (C++11/14/17/20)
- Keep answers focused and not too long (under 400 words usually)
- If showing output, label it clearly
- Highlight important keywords or concepts with **bold**`,
          messages:[...messages.map(m=>({role:m.role,content:m.content})),userMsg]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, couldn't get a response.";
      setMessages(m=>[...m,{role:"assistant",content:reply}]);
    } catch(e) {
      setMessages(m=>[...m,{role:"assistant",content:"ΓÜá∩╕Å Connection error. Please try again."}]);
    }
    setLoading(false);
  };

  const formatMsg = (text) => {
    // Simple markdown: **bold**, `code`, ```cpp blocks
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part,i)=>{
      if(part.startsWith("```")&&part.endsWith("```")){
        const code = part.slice(part.indexOf("\n")+1,-3);
        return <pre key={i} style={{background:"#060d1f",border:"1px solid #1e2d4a",borderRadius:8,padding:"12px 14px",fontFamily:"'JetBrains Mono',Consolas,monospace",fontSize:"0.76rem",lineHeight:1.6,overflowX:"auto",margin:"8px 0",color:"#e2e8f0"}}>{code}</pre>;
      }
      if(part.startsWith("`")&&part.endsWith("`")){
        return <code key={i} style={{fontFamily:"monospace",background:"rgba(0,212,255,0.1)",color:"#00d4ff",padding:"1px 5px",borderRadius:3,fontSize:"0.85em"}}>{part.slice(1,-1)}</code>;
      }
      if(part.startsWith("**")&&part.endsWith("**")){
        return <strong key={i} style={{color:"#00d4ff"}}>{part.slice(2,-2)}</strong>;
      }
      // Handle newlines
      return <span key={i}>{part.split("\n").map((line,j,arr)=><span key={j}>{line}{j<arr.length-1&&<br/>}</span>)}</span>;
    });
  };

  return (
    <div style={{maxWidth:780,margin:"0 auto"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:"1.5rem",fontWeight:700,marginBottom:6}}>≡ƒñû C++ OOP AI Tutor</div>
        <div style={{fontSize:13,color:"#64748b"}}>Powered by Claude ┬╖ Ask anything about C++ OOP, templates, STL, patterns</div>
      </div>

      {/* Suggestions */}
      {messages.length<=1&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{padding:"7px 13px",borderRadius:20,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.15)",color:"#7da8c4",fontFamily:"inherit",fontSize:12,cursor:"pointer",transition:"all 0.18s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,212,255,0.12)";e.currentTarget.style.color="#00d4ff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,212,255,0.06)";e.currentTarget.style.color="#7da8c4";}}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div style={{background:"#0a0e1a",border:"1px solid #1e2d4a",borderRadius:14,overflow:"hidden"}}>
        <div style={{height:460,overflowY:"auto",padding:"20px 20px 8px"}}>
          {messages.map((m,i)=>(
            <div key={i} style={{marginBottom:18,display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"85%",padding:"12px 16px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"2px 12px 12px 12px",background:m.role==="user"?"linear-gradient(135deg,rgba(124,58,237,0.25),rgba(0,212,255,0.15))":"rgba(15,22,41,0.95)",border:m.role==="user"?"1px solid rgba(124,58,237,0.3)":"1px solid #1e2d4a",fontSize:"0.87rem",lineHeight:1.7,color:"#e2e8f0"}}>
                {m.role==="assistant"&&<div style={{fontSize:"0.68rem",color:"#00d4ff",fontWeight:700,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>≡ƒñû AI Tutor</div>}
                {formatMsg(m.content)}
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:4,padding:"12px 16px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#00d4ff",animation:`bounce 1.2s ${i*0.2}s infinite`}}/>)}
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"12px 16px",borderTop:"1px solid #1e2d4a",display:"flex",gap:10}}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)}
            placeholder="Ask about C++ OOP... (Enter to send)"
            style={{flex:1,background:"rgba(0,212,255,0.04)",border:"1px solid #1e2d4a",borderRadius:9,padding:"10px 14px",color:"#e2e8f0",fontFamily:"inherit",fontSize:14,outline:"none"}}
          />
          <button onClick={()=>send(input)} disabled={loading||!input.trim()}
            style={{padding:"10px 20px",borderRadius:9,background:loading||!input.trim()?"#1e2d4a":"linear-gradient(135deg,#7c3aed,#00d4ff)",color:"#fff",border:"none",cursor:loading||!input.trim()?"not-allowed":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,transition:"all 0.2s"}}>
            {loading?"...":"Send"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}
