import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:5000/api/resources";

 
  const fetchResources = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch resources");
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.dueDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        alert("Resource Updated Successfully");
      }

      else {
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        alert("Resource Added Successfully");
      }

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
      });

      setEditingId(null);

      fetchResources();

      setActiveTab("view");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const deleteResource = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      alert("Resource Deleted Successfully");

      fetchResources();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

 const editResource = (resource) => {
    setEditingId(resource._id);

    setActiveTab("edit");

    setFormData({
      title: resource.title,
      description: resource.description,
      priority: resource.priority,
      status: resource.status,
      dueDate: resource.dueDate.split("T")[0],
    });
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h1>ShareSphere Resource Management</h1>
        <p>Smart Community Resource Sharing Platform</p>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
       <img
  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f"
  alt="students"
/>

        <div className="hero-content">
          <h2>Welcome to ShareSphere</h2>

          <p>
            Manage and organize community resources efficiently.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("add")}>
          Add Resource
        </button>

        <button onClick={() => setActiveTab("view")}>
          View Resources
        </button>

        <button onClick={() => setActiveTab("view")}>
  Manage Resources
</button>
      </div>

      <div className="container">

        {/* Add/Edit Form */}
        {(activeTab === "add" || activeTab === "edit") && (
          <div className="form-section">

            <h2>
              {editingId
                ? "Update Resource"
                : "Add New Resource"}
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="title"
                placeholder="Resource Title"
                value={formData.title}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Resource Description"
                value={formData.description}
                onChange={handleChange}
              />

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />

              <button className="add-btn" type="submit">
                {editingId
                  ? "Update Resource"
                  : "Add Resource"}
              </button>

            </form>
          </div>
        )}

        {/* View Resources */}
        {activeTab === "view" && (
          <div className="resource-section">

            <h2>Community Resources</h2>

            {resources.length === 0 ? (
              <p>No resources available</p>
            ) : (
              resources.map((resource) => (
                <div
                  className="resource-card"
                  key={resource._id}
                >

                  <h3>{resource.title}</h3>

                  <p>{resource.description}</p>

                  <span className="badge priority">
                    {resource.priority}
                  </span>

                  <span className="badge status">
                    {resource.status}
                  </span>

                  <p>
                    <strong>Due Date:</strong>{" "}
                    {resource.dueDate.split("T")[0]}
                  </p>

                  <button
                    className="edit-btn"
                    onClick={() => editResource(resource)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteResource(resource._id)
                    }
                  >
                    Delete
                  </button>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;