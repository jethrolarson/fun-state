# FunState

FunState is a React architecture and library for doing fractal, compositional state in a way that is typesafe,
testable, and easy to refactor.

# Motivation

Don't you hate when you have to update 4 different files (constants, actions, reducer, component, and interface) to make a checkbox do something?

On top of that, manually updating nested data immutably is messy and error prone:

```ts
SET_TODO_DONE: (state: State): State => {
  return {
    ...state,
    users: state.todos.map((user) => {
      if ((user.id = action.payload.id)) {
        return {...user, done: action.payload.checked}
      }
      return user
    })
  }
}
```

And even if you do everything right redux just doesn't seem TypeScript native. Its types are an
afterthought.

<img src="https://i.imgflip.com/46vcs3.jpg" alt="matrix reference joke" />

With <b>FunState</b> you can make the update in the same file as the checkbox and still have type-safety, testability, and much more concise code.

# Getting Started

FunState works with any react 16.8+ application. Usage without TypeScript works but isn't recommended.

1. `npm install -S fun-state`
2. Pick or create a component hold the FunState:

```ts
import {index} from 'accessors-ts';
import {useFunState} from 'fun-state';
import {Todo, TodoItem} from './Todo/TodoItem';
...

// Define an interface for your App's state
interface TodoApp {
  users: Todo[]
  ...
}

// Define an initial state:
const initialAppState: TodoApp = {
  todos: [],
  ...
};

// Create a FunState instance within a React.FunctionalComponent (uses react hooks)
const App = () => {
  const funState = useFunState(initialAppState);
  const {todos} = funState.get();
  return (
    {/* Child components can get the root state directly */}
    <SelectAll {...funState} />
    {todos.map((item, i) => (
      {/* or focus down to the state the component needs to interact with */}
      <TodoItem {...funState.prop('todos').focus(index(i))} />
    ))}
  );
};
```

3. Create child components focused on a piece of your state:

```ts
// MyChildComponent.tsx
// Should be imported into the parent state interface
export interface ChildState {
  checked: boolean;
}

export const MyChildComponent: React.FC<FunState<ChildState>> = ({get, set}) => (
  <input type="checkbox" checked={get()} onChange=(e => set(e.currentTarget.checked))>
);
```

# More examples

See [fun-state-examples](https://github.com/jethrolarson/fun-state-examples) for a sample standalone application.

# When to useFunState

- When you're in a situation where you would gain benefit from redux or other state-managment libraries.
- You want composable/modular state
- You want to gradually try out another state management system without fully converting your app.

# When not to useFunState

- When your data or component heirachy is mostly flat.
- When our app is not as complex as the token TodoApp then adding these concepts and tools is probably overkill.
- You're avoiding `FunctionComponent`s

# Tips

- Keep your FunState Apps simple and delegate the complex logic to pure child components, using `.sub()` where practical.
- Use Accessor composition to drill down into deep parts of your tree or operate on multiple items. See `./TodoApp` or <a href="https://github.com/jethrolarson/accessor-ts">accessor-ts docs</a> for examples.
- If child components need data from multiple places in the state tree, you can create and pass more than one FunState or just pass the root and then query out what you need with Accessors.
- Unit test your updaters and snapshot test your components.
- As usual, memoizing event handlers can help if you run into rendering performance problems.

# Basic Architecture

https://app.lucidchart.com/invitations/accept/657b566b-5302-49c2-a5fa-d0e5957b4899

# API

## useFunState

```ts
<State>(initialState: State) => FunState<State>
```

Creates an react-hooks instance of the state machine with a starting state. Any component that calls this becomes an "App".

## funState

```ts
<State>(initialState: State) => FunState<State>
```

Creates a library-agnostic instance of the state machine with a starting state. This is useful when unit testing functions or components that take a FunState.

## pureState

```ts
<State>({getState, modState}: StateEngine<State>): FunState<State>
```

Creates an instance of funState given a custom StateEngine. If you want to add support for preact or other libraries with things like hooks you want this.

## Accessor

See <a href="https://github.com/jethrolarson/accessor-ts">accessor-ts</a>

## FunState

```ts
export interface FunState<State> {
  get: () => State
  /** Query the state using an accessor */
  query: <A>(acc: Accessor<State, A>) => A[]
  /** Transform the state with the passed function */
  mod: Updater<State>
  /** Replace the state */
  set: (val: State) => void
  /** Create a new FunState focused at the passed accessor */
  focus: <SubState>(acc: Accessor<State, SubState>) => FunState<SubState>
  /** focus state at passed key (sugar over `focus(prop(k))`) */
  prop: <K extends keyof State>(key: K) => FunState<State[K]>
}
```

Data structure that holds the state along with a stateful function that updates it.

## merge

```ts
<State>(fs: FunState<State>) => (part: Partial<State>) => void
```

Mutably merge a partial state into a FunState


# TODO / Contributing

- Give feedback!
- Add performance benchmarks
- File bugs
- Improve documentation
- Add examples
