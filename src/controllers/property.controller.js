const pool = require("../config/db"); // Conexión a la BD

// Crear una nueva propiedad
const createProperty = async (req, res) => {
  const { nombre, tipo } = req.body;

  // Validar que los campos sean obligatorios
  if (!nombre || !tipo) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  // Validar que el tipo sea uno de los permitidos
  const tiposValidos = ["texto", "numero", "fecha", "check"]; // Asegura que coincide con el ENUM
  if (!tiposValidos.includes(tipo.toLowerCase())) {
    return res.status(400).json({
      message: "El tipo debe ser uno de: texto, numero, fecha, check.",
    });
  }

  try {
    console.log("🔵 Verificando existencia del nombre en la BD...");

    // ⚠️ Cambia `nombre` por `name`
    const [existingProperty] = await pool.query(
      "SELECT id FROM properties WHERE name = ?",
      [nombre] // Ahora el nombre está en la columna 'name'
    );

    if (existingProperty.length > 0) {
      return res
        .status(400)
        .json({ message: "El nombre de la propiedad ya existe, elige otro." });
    }

    console.log("✅ No existe, insertando...");

    // ⚠️ Cambia `nombre` por `name`
    const [result] = await pool.query(
      "INSERT INTO properties (name, type) VALUES (?, ?)",
      [nombre, tipo]
    );

    res
      .status(201)
      .json({ message: "Propiedad creada exitosamente", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al crear propiedad:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const getAllProperties = async (req, res) => {
  try {
    console.log("🔵 Obteniendo todas las propiedades...");

    // Consulta para obtener todas las propiedades
    const [properties] = await pool.query("SELECT * FROM properties");

    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error al obtener propiedades:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`🔵 Buscando propiedad con ID: ${id}`);

    // Consulta para obtener la propiedad por ID
    const [property] = await pool.query(
      "SELECT * FROM properties WHERE id = ?",
      [id]
    );

    // Si no se encuentra la propiedad, responder con 404
    if (property.length === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada." });
    }

    res.status(200).json(property[0]); // Devolver solo el primer resultado
  } catch (error) {
    console.error("❌ Error al obtener propiedad:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo } = req.body;

  // Validar que los campos sean obligatorios
  if (!nombre || !tipo) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  // Validar que el tipo sea uno de los permitidos
  const tiposValidos = ["texto", "número", "fecha", "check"];
  if (!tiposValidos.includes(tipo.toLowerCase())) {
    return res
      .status(400)
      .json({
        message: "El tipo debe ser uno de: texto, número, fecha, check.",
      });
  }

  try {
    console.log(`🔵 Verificando existencia de la propiedad con ID: ${id}`);

    // Verificar si la propiedad existe
    const [property] = await pool.query(
      "SELECT * FROM properties WHERE id = ?",
      [id]
    );

    if (property.length === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada." });
    }

    // Si el nombre ha cambiado, verificar que no esté duplicado
    if (property[0].name !== nombre) {
      console.log(
        `🔵 Verificando si el nuevo nombre "${nombre}" ya existe en la BD...`
      );
      const [existingProperty] = await pool.query(
        "SELECT id FROM properties WHERE name = ?",
        [nombre]
      );

      if (existingProperty.length > 0) {
        return res
          .status(400)
          .json({
            message: "El nombre de la propiedad ya existe, elige otro.",
          });
      }
    }

    // Actualizar la propiedad
    await pool.query("UPDATE properties SET name = ?, type = ? WHERE id = ?", [
      nombre,
      tipo,
      id,
    ]);

    res.status(200).json({ message: "Propiedad actualizada exitosamente." });
  } catch (error) {
    console.error("❌ Error al actualizar propiedad:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`🔵 Verificando si la propiedad con ID ${id} existe...`);

    // Verificar si la propiedad existe
    const [property] = await pool.query(
      "SELECT * FROM properties WHERE id = ?",
      [id]
    );

    if (property.length === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada." });
    }

    console.log(`🔵 Eliminando relaciones de la propiedad con ID ${id}...`);
    // 🚨 Ajusta esto según la estructura de tu base de datos 🚨
    await pool.query("DELETE FROM type_properties  WHERE property_id = ?", [
      id,
    ]);

    console.log(`🔵 Eliminando la propiedad con ID ${id}...`);
    await pool.query("DELETE FROM properties WHERE id = ?", [id]);

    res.status(200).json({ message: "Propiedad eliminada exitosamente." });
  } catch (error) {
    console.error("❌ Error al eliminar propiedad:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
