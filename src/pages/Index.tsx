import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue.trim(), completed: false }]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="w-full max-w-md px-6">
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="rounded-2xl border bg-card p-8 shadow-elegant">
            <h1 className="mb-6 text-2xl font-bold text-foreground">
              Todo List
            </h1>

            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button
                onClick={addTodo}
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {todos.length === 0 ? (
                <li className="text-center text-muted-foreground py-4">
                  No tasks yet. Add one above!
                </li>
              ) : (
                todos.map(todo => (
                  <li
                    key={todo.id}
                    className="flex items-center gap-3 rounded-lg border bg-background p-3"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        todo.completed
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {todos.length > 0 && (
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>{todos.filter(t => t.completed).length} of {todos.length} completed</span>
                <div className="h-2 w-32 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${(todos.filter(t => t.completed).length / todos.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 animate-in fade-in duration-1000 delay-300 text-center text-sm text-muted-foreground">
          Powered by Trustable
        </p>
      </div>
    </div>
  );
};

export default Index;
