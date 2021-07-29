import { useEffect, useState } from "react";
import "./App.css";
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  const [todo, setTodo] = useState("");
  // boolean state to know if we are editing (this will let us display
  // different inputs based on a condition (conditional rendering)
  const [isEditing, setIsEditing] = useState(false);
  // object state to set so we know which todo item we are editing
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  // function to get the value of the edit input and set the new state
  function handleEditInputChange(e) {
    // set the new state value to what's currently in the edit input box
    setCurrentTodo({ ...currentTodo, text: e.target.value });
    console.log(currentTodo);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: todos.length + 1,
          text: todo.trim(),
        },
      ]);
    }

    setTodo("");
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(removeItem);
  }

  // function to edit a todo item
  function handleUpdateTodo(id, updatedTodo) {
    // here we are mapping over the todos array - the idea is check if the todo.id matches the id we pass into the function
    // if the id's match, use the second parameter to pass in the updated todo object
    // otherwise just use old todo
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });
    // set editing to false because this function will be used inside a onSubmit function - which means the data was submited and we are no longer editing
    setIsEditing(false);
    // update the todos state with the updated todo
    setTodos(updatedItem);
  }

  // function to handle when the "Edit" button is clicked
  function handleEditClick(todo) {
    // set editing to true
    setIsEditing(true);
    // set the currentTodo to the todo item that was clicked
    setCurrentTodo({ ...todo });
  }

  return (
    <div className="App" style={{ "text-align": "left" }}>
      {/* We need to conditionally render different inputs based on if we are in editing mode */}
      {isEditing ? (
        // if we are editing - display the edit todo input
        // make sure to add the handleEditFormSubmit function in the "onSubmit" prop
        <form onSubmit={handleEditFormSubmit}>
          {/* we've added an h2 element */}
          <h2 style={{ padding: "5%" }}>Edit Todo</h2>
          {/* also added a label for the input */}
          <label htmlFor="editTodo" style={{ padding: "5%" }}>
            Edit todo:{" "}
          </label>
          {/* notice that the value for the update input is set to the currentTodo state */}
          {/* also notice the handleEditInputChange is being used */}
          <input
            name="editTodo"
            type="text"
            placeholder="Edit todo"
            value={currentTodo.text}
            onChange={handleEditInputChange}
            style={({ padding: "25%" }, { "margin-right": "25px" })}
          />
          {/* here we added an "update" button element - use the type="submit" on the button which will still submit the form when clicked using the handleEditFormSubmit function */}
          <Button
            type="submit"
            variant="outline-success"
            style={{ "margin-right": "25px" }}
          >
            Update
          </Button>
          {/* here we added a "Cancel" button to set isEditing state back to false which will cancel editing mode */}
          <Button variant="outline-danger" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        // if we are not editing - display the add todo input
        // make sure to add the handleFormSubmit function in the "onSubmit" prop
        <div>
          <h2 style={{ padding: "5%" }}>Add Todo</h2>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="todo" style={{ padding: "5%" }}>
              Add todo:
            </label>
            <input
              name="todo"
              type="text"
              placeholder="Create a new todo"
              value={todo}
              onChange={handleInputChange}
              style={({ padding: "25%" }, { "margin-right": "25px" })}
            />
            <Button type="submit" variant="outline-success">
              Add
            </Button>
          </form>
        </div>
      )}
      <div>
        {todos.map((todo, index) => (
          <Card>
            <Card.Body>
              <div className="todo">
                <label style={{ padding: "5%" }}>{todo.text}</label>
                <Button
                  variant="outline-success"
                  onClick={() => handleEditClick(todo)}
                  style={{ "margin-right": "25px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
