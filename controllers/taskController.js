const { db } = require("../firebaseConfig"); // Importa la configuración de Firestore
const { tasks } = require("../models/task"); // Mantiene la lógica existente

exports.getAllTasks = (req, res) => {
  // Se marco el codigo de estado de éxito.
  res.status(200).json(tasks);
};

exports.getTaskById = (req, res) => {
  const id = req.params.id; // Cambiar a string ya que Firestore usa strings para IDs
  const task = tasks.find((item) => item.id === id);
  if (task) {
    // Se establece el codigo de estado 200, que indica que la solicitud ha tenido éxito.
    res.status(200).json(task);
  } else {
    // Se indica el codigo de estado 404, el servidor no pudo encontrar la página o archivo solicitado
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

exports.createTask = (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
  };
  tasks.push(newTask);
  // Se realiza el codigo de estado 201, el cual significa que una solicitud HTTP se cumplió y creó un nuevo recurso
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const id = req.params.id; // Cambiar a string para la búsqueda
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.title = req.body.title;
    // Se establece el codigo de estado 200, que indica que la solicitud ha tenido éxito.
    res.status(200).json(task);
  } else {
    // Se indica el codigo de estado 404, el servidor no pudo encontrar la página o archivo solicitado
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

// 🔥 Nueva función para eliminar una tarea específica
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id; // Obtener el ID desde los parámetros

  try {
    const taskRef = db.collection("tasks").doc(taskId); // Referencia al documento en Firestore
    const taskSnapshot = await taskRef.get(); // Obtener el documento

    if (!taskSnapshot.exists) {
      return res.status(404).json({ message: "Tarea no encontrada" }); // Si no existe
    }

    await taskRef.delete(); // Eliminar el documento
    res.status(200).json({ message: "Tarea eliminada correctamente" }); // Respuesta de éxito
  } catch (error) {
    console.error("Error al eliminar la tarea:", error); // Log de error
    res.status(500).json({ error: error.message }); // Respuesta de error
  }
};
