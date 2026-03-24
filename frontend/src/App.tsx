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

  const addTask = async () => {
    const title = prompt("请输入任务标题");
    if (!title) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    fetchTasks();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await fetch(`/api/tasks/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ completed: !completed }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}/delete`, {
      method: "POST",
    });
    fetchTasks();
  }

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
      <h1>Task List.</h1>
      <h2>我是更新后的界面 v1</h2>
      <button onClick={fetchTasks}>Fetch Tasks</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.completed ? "Completed" : "Pending"}
            <button onClick={() => toggleComplete(task.id, task.completed)}>
              {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addTask()}>Add Task</button>
    </div>
  );
}

export default App;
