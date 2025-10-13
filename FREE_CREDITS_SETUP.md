# 🎁 Configuration des Crédits Gratuits

## 📋 Vue d'ensemble

Ce système donne **3 crédits gratuits** à chaque nouvel utilisateur qui s'inscrit, leur permettant de tester le générateur Home Staging avant de payer.

---

## 🚀 Installation

### Étape 1 : Exécuter le Script SQL dans Supabase

1. Ouvrir le **Dashboard Supabase**
2. Aller dans **SQL Editor**
3. Créer une nouvelle query
4. Copier-coller le contenu de `supabase-trigger-free-credits.sql`
5. Cliquer sur **Run**

Le trigger est maintenant actif ! ✅

---

## 🔄 Fonctionnement

### Parcours Utilisateur

```
1. Nouvel utilisateur s'inscrit (Google OAuth)
   ↓
2. Trigger Supabase s'exécute automatiquement
   ↓
3. Création du profil avec :
   - credits: 3
   - plan: 'trial'
   - subscription_status: 'trialing'
   ↓
4. L'utilisateur voit "🎁 3 crédits gratuits" dans le header
   ↓
5. Génération d'images (3 → 2 → 1 → 0)
   ↓
6. À 0 crédits : redirection vers /#pricing
   ↓
7. Paiement Stripe (système existant)
   ↓
8. Mise à jour du profil :
   - credits: 30 ou 100
   - plan: 'starter' ou 'professional'
   - subscription_status: 'active'
   - stripe_customer_id: 'cus_xxx'
   - stripe_subscription_id: 'sub_xxx'
```

---

## 🎨 Affichage des Crédits

### Mode Trial (Essai Gratuit)

**Affichage** : `🎁 3 crédits gratuits`

- Badge vert avec emoji cadeau
- Pas de bouton "Upgrade" tant qu'il reste des crédits
- Quand 0 crédit : bouton "Choisir un plan"

### Mode Payant (Après Paiement)

**Affichage** : `30 crédits` (ou 100)

- Badge vert sans emoji
- Bouton "Upgrade" visible

---

## 🔧 Détails Techniques

### Trigger SQL

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, credits, plan, subscription_status)
  VALUES (NEW.id, NEW.email, 3, 'trial', 'trialing')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Composant React

**Fichier** : `components/credit-display.tsx`

```typescript
const { credits, plan } = useCredits()
const isTrial = plan === 'trial'

// Affichage conditionnel
{isTrial && '🎁 '}
{credits} crédit{credits > 1 ? 's' : ''}
{isTrial && ' gratuit' + (credits > 1 ? 's' : '')}
```

---

## 📊 États du Profil Utilisateur

### État 1 : Trial (Nouvel Utilisateur)

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "credits": 3,
  "plan": "trial",
  "subscription_status": "trialing",
  "stripe_customer_id": null,
  "stripe_subscription_id": null
}
```

### État 2 : Payant (Après Paiement)

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "credits": 30,
  "plan": "starter",
  "subscription_status": "active",
  "stripe_customer_id": "cus_xxx",
  "stripe_subscription_id": "sub_xxx"
}
```

---

## ⚠️ Points d'Attention

### 1. Abus Potentiel

**Problème** : Un utilisateur pourrait créer plusieurs comptes Google pour avoir 3 crédits à chaque fois.

**Solutions possibles** :
- Limiter par IP (1 essai par IP)
- Limiter par domaine email (1 essai par domaine)
- Ajouter un système de vérification (téléphone, etc.)

### 2. Coût API

**Impact** : 3 crédits gratuits × nombre d'inscriptions = coût API Gemini

**Surveillance** :
- Monitorer les coûts dans Google Cloud Console
- Ajuster à 2 crédits si nécessaire
- Mettre une limite quotidienne d'inscriptions si abus

### 3. Utilisateurs Existants

**Important** : Le trigger ne s'applique qu'aux **nouveaux** utilisateurs.

Les utilisateurs déjà inscrits gardent leur statut actuel (0 crédits ou plan payant).

---

## 🧪 Tests

### Test 1 : Nouvel Utilisateur

1. Se déconnecter de l'app
2. S'inscrire avec un nouveau compte Google
3. Vérifier l'affichage : `🎁 3 crédits gratuits`
4. Générer une image → `🎁 2 crédits gratuits`
5. Générer 2 autres images → `🎁 0 crédit gratuit`
6. Vérifier la redirection vers `/#pricing`

### Test 2 : Paiement Après Trial

1. Après avoir épuisé les 3 crédits gratuits
2. Cliquer sur "Choisir un plan"
3. Payer via Stripe
4. Vérifier que l'affichage change : `30 crédits` (sans emoji)
5. Vérifier que le plan est `starter` dans Supabase

### Test 3 : Vérification SQL

```sql
-- Voir tous les utilisateurs en mode trial
SELECT id, email, credits, plan, subscription_status, created_at
FROM user_profiles
WHERE plan = 'trial'
ORDER BY created_at DESC;

-- Voir les utilisateurs qui ont épuisé leur trial
SELECT id, email, credits, plan, subscription_status
FROM user_profiles
WHERE plan = 'trial' AND credits = 0;
```

---

## 🔄 Désactivation (Si Nécessaire)

Si tu veux désactiver temporairement les crédits gratuits :

```sql
-- Désactiver le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Réactiver plus tard
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 📈 Métriques à Suivre

1. **Taux de conversion Trial → Payant**
   - Combien d'utilisateurs payent après l'essai gratuit ?

2. **Utilisation moyenne des crédits gratuits**
   - Les utilisateurs utilisent-ils les 3 crédits ou abandonnent avant ?

3. **Coût par acquisition**
   - Coût API × nombre d'essais / nombre de conversions

4. **Temps moyen avant conversion**
   - Combien de temps entre l'inscription et le paiement ?

---

## ✅ Checklist de Déploiement

- [ ] Exécuter `supabase-trigger-free-credits.sql` dans Supabase
- [ ] Vérifier que le trigger existe : `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- [ ] Déployer le code modifié (`credit-display.tsx`)
- [ ] Tester avec un nouveau compte Google
- [ ] Vérifier l'affichage "🎁 3 crédits gratuits"
- [ ] Tester la génération d'images (déduction de crédits)
- [ ] Tester la redirection vers `/#pricing` à 0 crédits
- [ ] Tester le paiement et la transition vers plan payant
- [ ] Monitorer les coûts API dans les 48h suivantes

---

**Dernière mise à jour** : 13 octobre 2025

