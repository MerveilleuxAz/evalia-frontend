# Guide de Testabilité - Evalia Frontend

Ce document décrit l'architecture de test, les bonnes pratiques, et comment exécuter les tests pour le projet React Evalia.

## 1. Stack Technique

Nous utilisons une stack moderne et performante pour garantir la qualité de notre interface :
- **[Vitest](https://vitest.dev/)** : Le framework de test unitaire ultra-rapide propulsé par Vite.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** : L'outil standard pour tester les composants React en se concentrant sur le comportement utilisateur (DOM).
- **[jsdom](https://github.com/jsdom/jsdom)** : L'environnement simulant le navigateur pour nos tests.

## 2. Exécuter les tests

### En local (via npm)
Si vous développez localement avec Node.js installé, vous pouvez lancer les tests directement :

```bash
# Lancer tous les tests une fois
npm run test

# Lancer les tests en mode "watch" (se relance automatiquement aux changements)
npm run test:watch

# Lancer les tests avec un rapport de couverture de code
npm run coverage
```

### Via Docker
Si vous n'utilisez que Docker, vous pouvez exécuter les tests directement à l'intérieur du conteneur de développement :

```bash
# En supposant que votre conteneur s'appelle "frontend-evalia" ou similaire
docker exec -it <nom_du_conteneur_frontend> npm run test
```

## 3. Conventions & Organisation

### Où placer vos tests ?
Les tests doivent être placés au plus près des fichiers qu'ils valident, généralement dans le même dossier ou un sous-dossier `__tests__`.
L'extension de fichier doit être `.test.ts` ou `.test.tsx` (pour les composants).

**Exemple :**
```text
src/
  components/
    ui/
      Button.tsx
      Button.test.tsx      <-- Le fichier de test associé
```

### Nommage
Utilisez des blocs `describe` pour grouper les tests, et `it` ou `test` pour définir un cas spécifique. 
La description doit être claire sur ce que le composant est censé faire.

```tsx
describe('Composant Button', () => {
  it('devrait afficher le texte fourni', () => { ... });
  it('devrait être désactivé si la prop disabled est true', () => { ... });
});
```

### Méthodologie AAA (Arrange, Act, Assert)
1. **Arrange (Préparer)** : Mettre en place l'environnement (données mockées, rendu du composant).
2. **Act (Agir)** : Simuler l'action de l'utilisateur (cliquer sur un bouton, taper du texte).
3. **Assert (Vérifier)** : Vérifier que le résultat (le DOM) correspond à ce qui est attendu.

## 4. Exemples Concrets

### Tester un composant simple
Voici comment tester un composant d'UI basique (ex: un bouton).

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Button } from './Button';

test('Appel du callback au clic', async () => {
  // Arrange
  const handleClick = vi.fn(); // Création d'une fonction mock
  render(<Button onClick={handleClick}>Cliquez-moi</Button>);

  // Act
  const button = screen.getByRole('button', { name: /cliquez-moi/i });
  await userEvent.click(button);

  // Assert
  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Tester un composant avec du Routing ou du Contexte
Certains composants ont besoin d'être "enveloppés" (wrapped) par des Providers (ex: `MemoryRouter` pour `react-router-dom` ou `QueryClientProvider` pour `TanStack Query`).

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

test('Navigation rendue correctement', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Evalia/i)).toBeInTheDocument();
});
```

### Mocker un hook ou un module externe
Si votre composant dépend d'une API externe (ex: `api.competitions.list()`), vous devez utiliser `vi.mock()` pour simuler la réponse afin d'éviter d'appeler le vrai réseau lors des tests.

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from './Dashboard';
import * as api from '@/services/api';

// Mocker tout le module API
vi.mock('@/services/api', () => ({
  api: {
    competitions: {
      list: vi.fn(),
    }
  }
}));

test('Affiche un message de chargement puis les données', async () => {
  // Préparer la fausse réponse
  vi.mocked(api.api.competitions.list).mockResolvedValueOnce({ competitions: [] });

  render(<Dashboard />);

  // Vérifie le chargement
  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  // Attend que l'API réponde et vérifie le changement
  await waitFor(() => {
    expect(screen.getByText(/Aucune compétition/i)).toBeInTheDocument();
  });
});
```
