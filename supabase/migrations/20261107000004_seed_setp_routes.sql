-- ========================================================
-- RUTEA: Catálogo Oficial de Rutas SETPasto (20 Rutas)
-- ========================================================

-- 1. Garantizar columnas type y description en routes
ALTER TABLE routes ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'STANDARD';
ALTER TABLE routes ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE routes ALTER COLUMN code DROP NOT NULL;

-- 2. Inserción de las 20 rutas oficiales del SETPasto
INSERT INTO routes (id, name, type, description, is_active)
VALUES
  -- Rutas Estándar (C1 a C16)
  ('route-c1', 'Ruta C1', 'STANDARD', 'Catambuco - Centro - Torobajo', TRUE),
  ('route-c2', 'Ruta C2', 'STANDARD', 'La Paz - Altavista', TRUE),
  ('route-c3', 'Ruta C3', 'STANDARD', 'Corredor Oriental - Centro', TRUE),
  ('route-c4', 'Ruta C4', 'STANDARD', 'Sur - Villaflor - Pandiaco', TRUE),
  ('route-c5', 'Ruta C5', 'STANDARD', 'Puente Tabla - Briceño', TRUE),
  ('route-c6', 'Ruta C6', 'STANDARD', 'Aranda - Tamasagra', TRUE),
  ('route-c7', 'Ruta C7', 'STANDARD', 'Santa Mónica - Morasurco', TRUE),
  ('route-c8', 'Ruta C8', 'STANDARD', 'Anganoy - Centro', TRUE),
  ('route-c9', 'Ruta C9', 'STANDARD', 'Miraflores - Avenida Los Estudiantes', TRUE),
  ('route-c10', 'Ruta C10', 'STANDARD', 'Chamba - Centro - Chapal', TRUE),
  ('route-c11', 'Ruta C11', 'STANDARD', 'San Albano - Torobajo', TRUE),
  ('route-c12', 'Ruta C12', 'STANDARD', 'Cabrera - Centro', TRUE),
  ('route-c13', 'Ruta C13', 'STANDARD', 'Buesaquillo - Pandiaco', TRUE),
  ('route-c14', 'Ruta C14', 'STANDARD', 'Catambuco - Terminal', TRUE),
  ('route-c15', 'Ruta C15', 'STANDARD', 'San Fernando - Maridíaz', TRUE),
  ('route-c16', 'Ruta C16', 'STANDARD', 'Hospital - Unicentro', TRUE),

  -- Rutas Expresas (E1 a E4)
  ('route-e1', 'Ruta E1', 'EXPRESS', 'Aranda - Maridíaz - Torobajo', TRUE),
  ('route-e2', 'Ruta E2', 'EXPRESS', 'Terminal - Centro - Torobajo Expreso', TRUE),
  ('route-e3', 'Ruta E3', 'EXPRESS', 'Sur Oriente - Hospital Departamental', TRUE),
  ('route-e4', 'Ruta E4', 'EXPRESS', 'Lorenzo - Terminal - San Ezequiel', TRUE)
ON CONFLICT (id) DO NOTHING;
