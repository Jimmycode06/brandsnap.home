# 💳 Système de Paiement et d'Abonnement - Documentation Complète

## 📋 Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Structure des Tables Supabase](#structure-des-tables-supabase)
3. [Variables d'Environnement](#variables-denvironnement)
4. [Flux de Paiement Complet](#flux-de-paiement-complet)
5. [Webhook Stripe - Logique Détaillée](#webhook-stripe---logique-détaillée)
6. [API Routes](#api-routes)
7. [Dépannage et Réparation](#dépannage-et-réparation)

---

## 🎯 Vue d'ensemble

Le système gère les abonnements Stripe et la distribution de crédits aux utilisateurs. Voici les composants clés :

- **Stripe** : Gestion des paiements et abonnements
- **Supabase** : Base de données PostgreSQL pour stocker les profils utilisateurs
- **Webhooks** : Synchronisation automatique entre Stripe et Supabase
- **API Routes** : Endpoints pour checkout, webhooks, et finalization client-side

---

## 📁 Structure des Tables Supabase

### Table `user_profiles`

Cette table stocke toutes les informations utilisateur, y compris les données Stripe et les crédits.

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  
  -- Colonnes Stripe
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')),
  current_period_end TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_user_profiles_stripe_customer ON public.user_profiles(stripe_customer_id);
CREATE INDEX idx_user_profiles_subscription ON public.user_profiles(stripe_subscription_id);
```

#### Colonnes clés :

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID utilisateur (référence `auth.users`) |
| `email` | TEXT | Email utilisateur (unique) |
| `credits` | INTEGER | Nombre de crédits disponibles (NOT NULL, défaut: 0) |
| `stripe_customer_id` | TEXT | ID client Stripe (ex: `cus_xxx`) |
| `stripe_subscription_id` | TEXT | ID abonnement Stripe (ex: `sub_xxx`) |
| `subscription_status` | TEXT | Statut: `active`, `canceled`, `past_due`, `trialing`, `incomplete` |
| `plan` | TEXT | Plan choisi: `starter`, `professional`, `enterprise` |
| `current_period_end` | TIMESTAMPTZ | Date de fin de période d'abonnement |

### Table `generations`

Cette table stocke l'historique des images générées par les utilisateurs.

```sql
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('home-staging', 'marketing', 'video')),
  prompt TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Les politiques RLS garantissent que les utilisateurs ne peuvent accéder qu'à leurs propres données.

```sql
-- user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can do everything" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
```

---

## ⚙️ Variables d'Environnement

### Fichier `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Clé service_role pour bypass RLS

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx  # ou sk_live_xxx en production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # ou pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Secret pour vérifier les webhooks

# Stripe Price IDs (créés dans le Dashboard Stripe)
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PROFESSIONAL_PRICE_ID=price_xxx

# Admin (pour endpoint de réparation)
ADMIN_REPAIR_TOKEN=your-secure-random-token
```

### Plans et Crédits

Les plans sont configurés dans le code :

```typescript
const PLAN_CREDITS: Record<string, number> = {
  starter: 30,
  professional: 100,
  enterprise: 999999,
}

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_STARTER_PRICE_ID || '']: 'starter',
  [process.env.STRIPE_PROFESSIONAL_PRICE_ID || '']: 'professional',
}
```

---

## 🔄 Flux de Paiement Complet

### Étape 1 : L'utilisateur clique sur "Choisir un plan"

**Fichier** : `app/(marketing)/page.tsx` ou `app/upgrade/page.tsx`

L'utilisateur clique sur un bouton de plan (Starter ou Professional).

### Étape 2 : Création de la session Stripe Checkout

**API Route** : `app/api/stripe/checkout/route.ts`

```typescript
// POST /api/stripe/checkout
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [
    {
      price: priceId,  // STRIPE_STARTER_PRICE_ID ou STRIPE_PROFESSIONAL_PRICE_ID
      quantity: 1,
    },
  ],
  customer_email: user.email,
  metadata: {
    supabase_user_id: user.id,
  },
  success_url: `${origin}/home-staging?success=true&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/#pricing`,
})
```

**Résultat** : L'utilisateur est redirigé vers Stripe Checkout.

### Étape 3 : L'utilisateur paie sur Stripe

L'utilisateur entre ses informations de carte et valide le paiement.

### Étape 4 : Stripe envoie un webhook `checkout.session.completed`

**Destination** : `app/api/stripe/webhook/route.ts`

Stripe envoie automatiquement un événement POST à votre endpoint webhook configuré dans le Dashboard Stripe.

```
POST https://votre-domaine.com/api/stripe/webhook
```

**Important** : Le webhook est appelé **automatiquement par Stripe**, pas par le client.

### Étape 5 : Le webhook met à jour Supabase

Voir section [Webhook Stripe - Logique Détaillée](#webhook-stripe---logique-détaillée).

### Étape 6 : L'utilisateur est redirigé vers `/home-staging?success=true&session_id=xxx`

**Fichier** : `app/home-staging/page.tsx`

Le client appelle l'API `/api/stripe/finalize` avec le `session_id` pour **double-vérification** (au cas où le webhook a échoué ou est en retard).

```typescript
useEffect(() => {
  const finalizeStripeSession = async () => {
    const sessionId = searchParams.get('session_id')
    const success = searchParams.get('success')

    if (success === 'true' && sessionId && user && !hasFinalized.current) {
      hasFinalized.current = true
      const response = await fetch('/api/stripe/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: user.id }),
      })
      if (response.ok) {
        router.replace('/home-staging', { scroll: false })
        reloadCredits() // Force le rechargement des crédits
      }
    }
  }
  finalizeStripeSession()
}, [searchParams, user, router, reloadCredits])
```

### Étape 7 : L'utilisateur peut générer des images

Les crédits sont maintenant disponibles dans `user_profiles.credits`.

---

## 🔔 Webhook Stripe - Logique Détaillée

### Endpoint : `app/api/stripe/webhook/route.ts`

Le webhook reçoit des événements de Stripe et synchronise les données avec Supabase.

### Vérification de la Signature

**Essentiel pour la sécurité** : On vérifie que la requête vient bien de Stripe.

```typescript
const sig = req.headers.get('stripe-signature')!
const body = await req.text()

let event: Stripe.Event
try {
  event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
} catch (err: any) {
  console.error('Webhook signature verification failed:', err.message)
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
}
```

### Événements Traités

#### 1. `checkout.session.completed` - Nouvel abonnement créé

**Quand** : Juste après un paiement réussi lors du checkout.

**Logique** :

```typescript
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session

  // 1. Récupérer les IDs
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.supabase_user_id

  if (!userId) {
    console.error('No supabase_user_id in session metadata')
    break
  }

  // 2. Récupérer les détails de l'abonnement depuis Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  // 3. Déterminer le plan et les crédits
  const priceId = subscription.items.data[0]?.price.id
  const plan = PRICE_TO_PLAN[priceId]  // 'starter' ou 'professional'
  const credits = PLAN_CREDITS[plan]    // 30 ou 100

  // 4. Gérer current_period_end (peut être null/undefined)
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  // 5. Mettre à jour Supabase
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: 'active',
      plan: plan,
      credits: credits,
      current_period_end: currentPeriodEnd,
    })
    .eq('id', userId)

  if (updateError) {
    console.error('Supabase update error:', updateError)
  } else {
    console.log(`✅ User ${userId} subscribed to ${plan} with ${credits} credits`)
  }
  break
}
```

**Résultat attendu dans `user_profiles`** :

| Colonne | Valeur |
|---------|--------|
| `stripe_customer_id` | `cus_xxx` |
| `stripe_subscription_id` | `sub_xxx` |
| `subscription_status` | `active` |
| `plan` | `starter` ou `professional` |
| `credits` | `30` ou `100` |
| `current_period_end` | `2025-11-11T10:00:00.000Z` (exemple) |

#### 2. `invoice.payment_succeeded` - Renouvellement mensuel

**Quand** : Chaque mois, lorsque Stripe renouvelle automatiquement l'abonnement.

**Logique** :

```typescript
case 'invoice.payment_succeeded': {
  const invoice = event.data.object as Stripe.Invoice
  
  // Ignorer les factures sans abonnement (ex: paiements ponctuels)
  if (!invoice.subscription) break

  const customerId = invoice.customer as string

  // 1. Trouver l'utilisateur par stripe_customer_id
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('No user found for customer:', customerId)
    break
  }

  // 2. Récupérer les détails de l'abonnement
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const priceId = subscription.items.data[0]?.price.id
  const plan = PRICE_TO_PLAN[priceId]
  const credits = PLAN_CREDITS[plan]

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  // 3. RECHARGER les crédits (remplace l'ancien nombre)
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      credits: credits,  // ⚠️ Reset complet, pas d'addition
      subscription_status: 'active',
      current_period_end: currentPeriodEnd,
    })
    .eq('id', profile.id)

  if (updateError) {
    console.error('Supabase update error:', updateError)
  } else {
    console.log(`✅ Credits recharged for user ${profile.id}: ${credits} credits`)
  }
  break
}
```

**Comportement attendu** : Les crédits sont **remplacés** par le nombre du plan (30 ou 100), pas ajoutés.

#### 3. `customer.subscription.updated` - Changement de statut

**Quand** : L'utilisateur annule, met en pause, ou change son abonnement.

**Logique** :

```typescript
case 'customer.subscription.updated': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) break

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      subscription_status: subscription.status,  // active, canceled, past_due, etc.
      current_period_end: currentPeriodEnd,
    })
    .eq('id', profile.id)

  if (updateError) {
    console.error('Supabase update error:', updateError)
  } else {
    console.log(`✅ Subscription updated for user ${profile.id}`)
  }
  break
}
```

#### 4. `customer.subscription.deleted` - Abonnement annulé

**Quand** : L'abonnement est définitivement supprimé (après la fin de période si `cancel_at_period_end`).

**Logique** :

```typescript
case 'customer.subscription.deleted': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) break

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      subscription_status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('id', profile.id)

  if (updateError) {
    console.error('Supabase update error:', updateError)
  } else {
    console.log(`✅ Subscription deleted for user ${profile.id}`)
  }
  break
}
```

### Webhook Response

Le webhook doit **toujours** retourner un statut HTTP 200, sinon Stripe considère qu'il a échoué et le renvoie (avec backoff exponentiel).

```typescript
return NextResponse.json({ received: true })
```

---

## 🛠️ API Routes

### 1. `/api/stripe/checkout` - Créer une session de paiement

**Méthode** : `POST`

**Body** :
```json
{
  "priceId": "price_xxx",
  "userId": "uuid",
  "userEmail": "user@example.com"
}
```

**Réponse** :
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_xxx"
}
```

**Code complet** : `app/api/stripe/checkout/route.ts`

### 2. `/api/stripe/webhook` - Recevoir les événements Stripe

**Méthode** : `POST` (appelé par Stripe uniquement)

**Headers** :
- `stripe-signature`: Signature pour vérifier l'authenticité

**Code complet** : `app/api/stripe/webhook/route.ts`

**Configuration dans Stripe Dashboard** :
1. Aller dans **Developers** > **Webhooks**
2. Ajouter un endpoint : `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copier le **Signing secret** (`whsec_xxx`) et l'ajouter à `.env.local`

### 3. `/api/stripe/finalize` - Finalization client-side (fallback)

**Méthode** : `POST`

**Body** :
```json
{
  "sessionId": "cs_xxx",
  "userId": "uuid"
}
```

**Réponse** :
```json
{
  "success": true
}
```

**Rôle** : Agit comme un filet de sécurité si le webhook échoue ou est retardé. Appelé depuis `app/home-staging/page.tsx` après redirection.

**Code complet** : `app/api/stripe/finalize/route.ts`

**Logique** :

```typescript
export async function POST(req: NextRequest) {
  const { sessionId, userId: clientUserId } = await req.json()

  // 1. Récupérer la session Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product', 'subscription'],
  })

  if (session.status !== 'complete' || !session.subscription) {
    return NextResponse.json({ error: 'Session not complete' }, { status: 400 })
  }

  // 2. Extraire les données
  const subscription = session.subscription as Stripe.Subscription
  const customerId = session.customer as string
  const priceId = subscription.items.data[0]?.price.id
  const plan = PRICE_TO_PLAN[priceId]
  const credits = PLAN_CREDITS[plan]

  // 3. Déterminer l'userId (metadata ou lookup par customer_id)
  let userId = clientUserId || session.metadata?.supabase_user_id
  if (!userId) {
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    if (!profileData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    userId = profileData.id
  }

  // 4. Mettre à jour Supabase
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      plan: plan,
      credits: credits,
      current_period_end: currentPeriodEnd,
    })
    .eq('id', userId)

  if (updateError) {
    console.error('Supabase update error (finalize):', updateError)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`✅ Finalize: User ${userId} updated for plan ${plan}`)
  return NextResponse.json({ success: true })
}
```

### 4. `/api/admin/repair` - Réparation manuelle (admin uniquement)

**Méthode** : `POST`

**Headers** :
- `Authorization: Bearer ADMIN_REPAIR_TOKEN`

**Body** :
```json
{
  "email": "user@example.com"
}
```
ou
```json
{
  "userId": "uuid"
}
```

**Réponse** :
```json
{
  "success": true,
  "userProfile": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "starter",
    "credits": 30,
    "subscription_status": "active"
  }
}
```

**Rôle** : Permet de forcer manuellement la synchronisation des données Stripe → Supabase pour un utilisateur spécifique.

**Code complet** : `app/api/admin/repair/route.ts`

**Utilisation** :

```bash
curl -X POST https://votre-domaine.com/api/admin/repair \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_REPAIR_TOKEN" \
  -d '{"email": "user@example.com"}'
```

---

## 🔍 Dépannage et Réparation

### Problème : Les crédits ne se remplissent pas après paiement

#### Diagnostic

1. **Vérifier le webhook dans Stripe Dashboard** :
   - Aller dans **Developers** > **Webhooks**
   - Cliquer sur votre endpoint
   - Vérifier les événements récents et leur statut (✅ ou ❌)

2. **Vérifier les logs** :
   - Si l'événement a échoué, cliquer dessus et voir la réponse HTTP
   - Chercher les erreurs 400, 500, ou timeouts

3. **Vérifier Supabase** :
   - Se connecter au Dashboard Supabase
   - Aller dans **Table Editor** > `user_profiles`
   - Vérifier si la ligne existe et quels champs sont remplis

#### Solutions

##### Solution 1 : Resend l'événement depuis Stripe

1. Dans Stripe Dashboard, aller à **Developers** > **Webhooks**
2. Cliquer sur votre endpoint
3. Trouver l'événement `checkout.session.completed` qui a échoué
4. Cliquer sur **Resend**

##### Solution 2 : Utiliser l'endpoint admin repair

```bash
curl -X POST https://votre-domaine.com/api/admin/repair \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_REPAIR_TOKEN" \
  -d '{"email": "x10millionmarketing@gmail.com"}'
```

##### Solution 3 : Mise à jour manuelle SQL

En dernier recours, vous pouvez mettre à jour directement dans Supabase SQL Editor :

```sql
-- 1. Trouver l'utilisateur
SELECT * FROM user_profiles WHERE email = 'user@example.com';

-- 2. Mettre à jour manuellement (exemple pour plan starter)
UPDATE user_profiles
SET
  stripe_customer_id = 'cus_xxx',  -- Trouver dans Stripe
  stripe_subscription_id = 'sub_xxx',  -- Trouver dans Stripe
  subscription_status = 'active',
  plan = 'starter',
  credits = 30,
  current_period_end = '2025-11-11T10:00:00.000Z'
WHERE email = 'user@example.com';
```

### Problème : "Invalid time value" dans les logs webhook

**Cause** : `current_period_end` est `null` ou `undefined` et on essaie de le convertir.

**Solution** : Déjà corrigé dans le code actuel avec des garde-fous :

```typescript
const currentPeriodEnd = subscription.current_period_end
  ? new Date(subscription.current_period_end * 1000).toISOString()
  : null
```

### Problème : L'utilisateur est redirigé vers `/upgrade` au lieu de `/#pricing`

**Cause** : Mauvaise logique de redirection dans `app/home-staging/page.tsx`.

**Solution** : La logique actuelle vérifie :
- Nouvel utilisateur (pas de plan) → `/#pricing`
- Utilisateur avec plan mais 0 crédits → `/upgrade`

```typescript
if (user && credits === 0) {
  if (plan && subscriptionStatus === 'active' && !hasRedirectedUpgrade.current) {
    hasRedirectedUpgrade.current = true
    router.push('/upgrade')
    return
  }
  if ((!plan || subscriptionStatus !== 'active') && !hasRedirectedUpgrade.current) {
    hasRedirectedUpgrade.current = true
    router.push('/#pricing')
    return
  }
}
```

---

## 📊 Diagramme de Flux Complet

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Utilisateur clique sur "Choisir un plan"                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. POST /api/stripe/checkout                                        │
│    → Création session Stripe                                        │
│    → Redirection vers Stripe Checkout                               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Utilisateur paie sur Stripe                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
┌───────────────────────────┐  ┌────────────────────────────────────┐
│ 4a. Stripe envoie webhook │  │ 4b. Redirection vers               │
│     POST /api/stripe/     │  │     /home-staging?success=true     │
│     webhook               │  │     &session_id=xxx                │
│                           │  │                                    │
│ → Vérif signature         │  │ → POST /api/stripe/finalize       │
│ → Récup subscription      │  │ → Double vérification             │
│ → Calcul plan/credits     │  │ → Mise à jour si webhook a raté   │
│ → UPDATE user_profiles    │  │                                    │
└───────────────────────────┘  └────────────────────────────────────┘
                    └─────────┬─────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Table user_profiles mise à jour :                                │
│    - stripe_customer_id: cus_xxx                                    │
│    - stripe_subscription_id: sub_xxx                                │
│    - subscription_status: 'active'                                  │
│    - plan: 'starter' ou 'professional'                              │
│    - credits: 30 ou 100                                             │
│    - current_period_end: timestamp                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. L'utilisateur peut générer des images                            │
│    (credits sont déduits à chaque génération)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Configuration

- [ ] Tables Supabase créées (`user_profiles`, `generations`)
- [ ] RLS activé et politiques configurées
- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Prix créés dans Stripe Dashboard (`STRIPE_STARTER_PRICE_ID`, etc.)
- [ ] Webhook configuré dans Stripe Dashboard pointant vers `/api/stripe/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté à `.env.local`
- [ ] `ADMIN_REPAIR_TOKEN` généré et ajouté
- [ ] Tests de paiement effectués en mode test
- [ ] Vérification que les crédits se remplissent correctement

---

## 📞 Support

Si un problème persiste après avoir suivi ce guide :

1. Vérifier les logs Stripe (Dashboard > Webhooks > Events)
2. Vérifier les logs Vercel (Dashboard > Project > Deployments > Logs)
3. Vérifier les données Supabase (Table Editor)
4. Utiliser l'endpoint `/api/admin/repair` pour forcer la synchronisation
5. Resend l'événement webhook depuis Stripe

---

**Dernière mise à jour** : 11 octobre 2025

