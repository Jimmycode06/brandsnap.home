# 🚀 Configuration Stripe + Crédits

## ✅ Ce qui a été fait

1. ✅ Routes API Stripe créées (`/api/stripe/checkout` et `/api/stripe/webhook`)
2. ✅ Schéma SQL Supabase créé (`supabase-stripe-setup.sql`)
3. ✅ Composant `PricingButton` pour les paiements
4. ✅ Intégration dans la page de pricing
5. ✅ Package Stripe installé

---

## 📝 Étapes à suivre maintenant

### 1️⃣ **Configurer Supabase**

Exécute le fichier SQL dans ton projet Supabase :

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Va dans **SQL Editor**
4. Copie le contenu de `supabase-stripe-setup.sql`
5. Exécute le script

Cela va créer :
- La table `user_profiles` avec colonnes Stripe et crédits
- Les triggers automatiques
- Les policies de sécurité

### 2️⃣ **Récupérer les clés Supabase**

Dans ton projet Supabase → **Settings** → **API** :

- `NEXT_PUBLIC_SUPABASE_URL` : Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : anon public key
- `SUPABASE_SERVICE_ROLE_KEY` : service_role key (⚠️ secret!)

### 3️⃣ **Configurer Stripe**

#### A. Créer le produit Professional

1. Va sur https://dashboard.stripe.com/products
2. Clique **+ Add product**
3. Nom : **Professional**
4. Prix : **49 EUR** / mois (récurrent)
5. Copie le **Price ID** (commence par `price_...`)

#### B. Configurer le Webhook

1. Va sur https://dashboard.stripe.com/webhooks
2. Clique **+ Add endpoint**
3. URL : `https://brandsnap-home.vercel.app/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie le **Signing secret** (commence par `whsec_...`)

#### C. Récupérer les clés API

Dans https://dashboard.stripe.com/apikeys :

- `STRIPE_SECRET_KEY` : Secret key (commence par `sk_test_...`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Publishable key (commence par `pk_test_...`)

### 4️⃣ **Ajouter les variables d'environnement sur Vercel**

Va sur https://vercel.com → Ton projet → **Settings** → **Environment Variables**

Ajoute ces variables :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_1SGNchDS5DrKB4SxrahLyTQb
STRIPE_PROFESSIONAL_PRICE_ID=price_xxx (ton Price ID Professional)

# Fal.ai (déjà configuré)
FAL_KEY=xxx
```

⚠️ **Important** : Ajoute ces variables pour **tous les environnements** (Production, Preview, Development)

### 5️⃣ **Redéployer sur Vercel**

Après avoir ajouté les variables :
- Redéploie ton projet (ou fais un push sur GitHub)
- Vercel va automatiquement redéployer avec les nouvelles variables

---

## 🎯 Comment ça fonctionne

### Flow utilisateur

1. **User clique "Commencer" sur plan Starter**
   → Redirigé vers Stripe Checkout

2. **User paie 29€**
   → Stripe envoie webhook `checkout.session.completed`

3. **Webhook reçu**
   → Crée/met à jour `user_profiles` :
   - `credits = 30`
   - `plan = 'starter'`
   - `subscription_status = 'active'`
   - `stripe_customer_id` et `stripe_subscription_id`

4. **User redirigé vers `/home-staging`**
   → Peut générer des images

5. **Chaque génération**
   → `-1 crédit` (déjà géré par `CreditContext`)

6. **Chaque mois (renouvellement)**
   → Webhook `invoice.payment_succeeded`
   → Reset des crédits : `credits = 30`

### Mapping des crédits

- **Starter** (29€/mois) : 30 crédits/mois
- **Professional** (49€/mois) : 100 crédits/mois
- **Enterprise** : Illimité (999999 crédits)

---

## 🧪 Tester en local

1. Copie `.env.example` vers `.env.local`
2. Remplis toutes les variables
3. Lance le serveur : `npm run dev`
4. Pour tester les webhooks en local, utilise Stripe CLI :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## ✅ Checklist finale

- [ ] SQL exécuté dans Supabase
- [ ] Produit Professional créé sur Stripe
- [ ] Webhook configuré sur Stripe
- [ ] Toutes les variables d'environnement ajoutées sur Vercel
- [ ] Projet redéployé sur Vercel
- [ ] Test d'un paiement en mode test

---

## 🆘 Besoin d'aide ?

Si tu as des erreurs :
1. Vérifie les logs Vercel (Functions)
2. Vérifie les logs Stripe (Webhooks)
3. Vérifie que toutes les variables d'environnement sont bien configurées

