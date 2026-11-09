const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('MISIÓN 56 - FloatingSearchBar: Barra superior acciona el TripPlanner vía onPress', () => {
  const searchBarPath = path.resolve(
    __dirname,
    '../src/components/floating/FloatingSearchBar/FloatingSearchBar.tsx'
  );
  assert.ok(fs.existsSync(searchBarPath), 'FloatingSearchBar.tsx debe existir');

  const content = fs.readFileSync(searchBarPath, 'utf8');
  assert.ok(content.includes('openTripPlanner'), 'Debe consumir openTripPlanner de useUiStore');
  assert.ok(
    content.includes('onPress={openTripPlanner}'),
    'La píldora superior debe tener onPress={openTripPlanner}'
  );
  assert.ok(content.includes('¿A dónde vas hoy?'), 'Debe mostrar texto descriptivo ¿A dónde vas hoy?');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `FloatingSearchBar.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 56 - BottomNavBar: Brújula eliminada y espacio distribuido entre 4 ítems', () => {
  const navBarPath = path.resolve(
    __dirname,
    '../src/components/navigation/BottomNavBar/BottomNavBar.tsx'
  );
  assert.ok(fs.existsSync(navBarPath), 'BottomNavBar.tsx debe existir');

  const content = fs.readFileSync(navBarPath, 'utf8');

  // La brújula ya no pertenece al BottomNavBar
  assert.ok(
    !content.includes('compass-outline'),
    'BottomNavBar no debe contener ícono compass-outline'
  );
  assert.ok(
    !content.includes('openTripPlanner'),
    'BottomNavBar no debe abrir openTripPlanner directamente'
  );

  // Mantiene los 4 ítems principales distribuidos
  assert.ok(content.includes('home'), 'Debe incluir ícono de Home');
  assert.ok(content.includes('bus'), 'Debe incluir ícono de Rutas');
  assert.ok(content.includes('clipboard-alert-outline'), 'Debe incluir ícono de Reportes');
  assert.ok(content.includes('account-outline'), 'Debe incluir ícono de Perfil');

  const lines = content.split('\n').length;
  assert.ok(lines <= 150, `BottomNavBar.tsx tiene ${lines} líneas, debe ser <= 150`);
});

test('MISIÓN 56 - UserProfileCard: 100% Vectorial sin ningún emoji', () => {
  const cardPath = path.resolve(
    __dirname,
    '../src/components/profile/UserProfileCard/UserProfileCard.tsx'
  );
  const utilsPath = path.resolve(
    __dirname,
    '../src/components/profile/UserProfileCard/userProfile.utils.ts'
  );
  assert.ok(fs.existsSync(cardPath), 'UserProfileCard.tsx debe existir');
  assert.ok(fs.existsSync(utilsPath), 'userProfile.utils.ts debe existir');

  const cardContent = fs.readFileSync(cardPath, 'utf8');
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  const combined = cardContent + utilsContent;

  // Verificación estricta de ausencia de emojis
  const forbiddenEmojis = ['🌱', '🧭', '⭐', '👑', '🥇', '🥈', '🥉', '🏆', '👤', '✕'];
  for (const emoji of forbiddenEmojis) {
    assert.ok(
      !combined.includes(emoji),
      `UserProfileCard y sus utilidades no deben contener el emoji ${emoji}`
    );
  }

  // Verificación de íconos vectoriales profesionales
  assert.ok(cardContent.includes('MaterialCommunityIcons'), 'Debe usar MaterialCommunityIcons');
  assert.ok(cardContent.includes('name="close"'), 'El botón cerrar debe ser ícono vectorial close');
  assert.ok(combined.includes('trophy'), 'Debe incluir íconos vectoriales de trofeo');

  const cardLines = cardContent.split('\n').length;
  assert.ok(cardLines <= 150, `UserProfileCard.tsx tiene ${cardLines} líneas, debe ser <= 150`);
});
