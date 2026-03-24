import { useEffect, useState } from "react";
import "./App.css";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.data);
  };

  const addTask = async (title: string) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    fetchTasks();
  };

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (isMounted) {
        setTasks(data.data);
      }
    };

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="App">
      <h1>Task List</h1>
      <button onClick={fetchTasks}>Fetch Tasks</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.completed ? "Completed" : "Pending"}
          </li>
        ))}
      </ul>
      <button onClick={() => addTask("New Task")}>Add Task</button>
    </div>
  );
}

export default App;
