const pool = require("../config/db"); // Conexión a la BD

// Crear un nuevo tipo
const createType = async (req, res) => {
  const { nombre, descripcion, propiedades } = req.body;

  // 1️⃣ Validación de datos de entrada
  if (!nombre || !descripcion || !Array.isArray(propiedades)) {
    return res
      .status(400)
      .json({
        message:
          "Todos los campos son obligatorios y propiedades debe ser un array.",
      });
  }

  try {
    // 2️⃣ Verificar si el nombre ya existe en la BD
    const [existingType] = await pool.query(
      "SELECT id FROM types WHERE name = ?",
      [nombre]
    ); // Cambia 'nombre' por 'name'

    if (existingType.length > 0) {
      return res
        .status(400)
        .json({ message: "El nombre del tipo ya existe, elige otro." });
    }

    // 3️⃣ Insertar el nuevo tipo en la BD
    const [result] = await pool.query(
      "INSERT INTO types (name, description) VALUES (?, ?)",
      [nombre, descripcion] // Asegúrate de que los nombres de las variables coincidan
    );

    const typeId = result.insertId; // Obtener el ID del nuevo tipo creado

    // 4️⃣ Insertar las relaciones entre el tipo y sus propiedades
    if (propiedades.length > 0) {
      const values = propiedades.map((propId) => [typeId, propId]);
      await pool.query(
        "INSERT INTO type_properties (type_id, property_id) VALUES ?",
        [values]
      );
    }

    // 5️⃣ Enviar respuesta exitosa
    res.status(201).json({ message: "Tipo creado exitosamente", id: typeId });
  } catch (error) {
    console.error("Error al crear tipo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los tipos con sus propiedades asociadas
const getAllTypes = async (req, res) => {
    try {
        // Obtener todos los tipos
        const [types] = await pool.query("SELECT * FROM types");

        // Si no hay tipos, devolver una lista vacía
        if (types.length === 0) {
            return res.json([]);
        }

        // Obtener las propiedades asociadas a cada tipo
        for (const type of types) {
            const [properties] = await pool.query(
                `SELECT p.id, p.name FROM properties p
                 INNER JOIN type_properties tp ON p.id = tp.property_id
                 WHERE tp.type_id = ?`,
                [type.id]
            );
            type.properties = properties;
        }

        res.json(types);
    } catch (error) {
        console.error("Error al obtener los tipos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Obtener un tipo por su ID con sus propiedades asociadas
const getTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener el tipo por ID
        const [types] = await pool.query("SELECT * FROM types WHERE id = ?", [id]);

        // Si no se encuentra el tipo, devolver un error 404
        if (types.length === 0) {
            return res.status(404).json({ message: "Tipo no encontrado" });
        }

        const type = types[0]; // Tomamos el primer resultado

        // Obtener las propiedades asociadas al tipo
        const [properties] = await pool.query(
            `SELECT p.id, p.name FROM properties p
             INNER JOIN type_properties tp ON p.id = tp.property_id
             WHERE tp.type_id = ?`,
            [id]
        );

        type.properties = properties; // Asociamos las propiedades al tipo

        res.json(type);
    } catch (error) {
        console.error("Error al obtener el tipo por ID:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Actualizar un tipo por ID
const updateType = async (req, res) => {
    const { id } = req.params;
    const { name, description, properties } = req.body;

    if (!name || !description || !Array.isArray(properties)) {
        return res.status(400).json({ message: "Todos los campos son obligatorios y 'properties' debe ser un array." });
    }

    try {
        // Verificar si el tipo existe
        const [existingType] = await pool.query("SELECT id FROM types WHERE id = ?", [id]);

        if (existingType.length === 0) {
            return res.status(404).json({ message: "Tipo no encontrado" });
        }

        // Verificar si el nuevo nombre ya existe en otro registro
        const [nameCheck] = await pool.query("SELECT id FROM types WHERE name = ? AND id <> ?", [name, id]);

        if (nameCheck.length > 0) {
            return res.status(400).json({ message: "El nombre del tipo ya existe, elige otro." });
        }

        // Actualizar el tipo en la base de datos
        await pool.query(
            "UPDATE types SET name = ?, description = ? WHERE id = ?",
            [name, description, id]
        );

        // Eliminar las relaciones antiguas en type_properties
        await pool.query("DELETE FROM type_properties WHERE type_id = ?", [id]);

        // Insertar las nuevas relaciones
        if (properties.length > 0) {
            const values = properties.map(propId => [id, propId]);
            await pool.query("INSERT INTO type_properties (type_id, property_id) VALUES ?", [values]);
        }

        res.status(200).json({ message: "Tipo actualizado exitosamente", id });
    } catch (error) {
        console.error("Error al actualizar tipo:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = { createType, getAllTypes, getTypeById, updateType };
