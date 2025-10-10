# Dashboard & Historique des Générations

## Configuration

### 1. Créer la table `generations` dans Supabase

Exécutez le SQL suivant dans votre éditeur SQL Supabase :

```sql
-- Voir le fichier supabase-generations-setup.sql
```

Ou directement depuis le Dashboard Supabase :
1. Allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez le contenu de `supabase-generations-setup.sql`
4. Exécutez la requête

### 2. Fonctionnalités

Le dashboard affiche maintenant :
- ✅ Les 10 dernières générations (Home Staging + Marketing)
- ✅ Aperçu des images générées
- ✅ Prompt utilisé pour chaque génération
- ✅ Date de création
- ✅ Téléchargement des images
- ✅ Suppression des générations

### 3. Sauvegarde automatique

Chaque génération (Home Staging ou Marketing) est automatiquement sauvegardée dans la table `generations` avec :
- `user_id` : ID de l'utilisateur
- `type` : 'home-staging' ou 'marketing'
- `prompt` : Le prompt utilisé
- `image_url` : URL de l'image générée
- `created_at` : Date de création

### 4. Navigation

Le dashboard est accessible via :
- Sidebar : Nouveau lien "Dashboard" avec icône
- URL directe : `/dashboard`

Les utilisateurs non connectés sont automatiquement redirigés vers la page d'accueil.

