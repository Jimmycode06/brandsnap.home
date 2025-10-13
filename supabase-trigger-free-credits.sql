-- ============================================
-- Trigger pour donner 3 crédits gratuits
-- à chaque nouvel utilisateur qui s'inscrit
-- ============================================

-- 1. Créer la fonction qui gère la création du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insérer un nouveau profil avec 3 crédits gratuits
  INSERT INTO public.user_profiles (
    id,
    email,
    credits,
    plan,
    subscription_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    3,              -- 3 crédits gratuits
    'trial',        -- Plan d'essai
    'trialing',     -- Statut trialing
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Si le profil existe déjà, ne rien faire
  
  RETURN NEW;
END;
$$;

-- 2. Supprimer le trigger s'il existe déjà (pour éviter les doublons)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Créer le trigger qui s'exécute après chaque inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Vérification (optionnel)
-- ============================================

-- Pour tester, vous pouvez vérifier que le trigger existe :
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Pour voir les profils créés avec le plan trial :
-- SELECT id, email, credits, plan, subscription_status, created_at
-- FROM user_profiles
-- WHERE plan = 'trial';

