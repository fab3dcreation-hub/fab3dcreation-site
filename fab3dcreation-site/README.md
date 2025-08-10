# Fab3DCréation — Boutique

Site statique + Functions Netlify (Stripe + Supabase) prêt à déployer.

## Déploiement rapide
1. Uploadez tout ce dossier dans votre dépôt GitHub.
2. Sur Netlify: **Import from Git** → sélectionnez le dépôt.
3. Dans *Site settings → Environment variables*, ajoutez :
   - `STRIPE_SECRET`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE`
   - `SUPABASE_ANON_KEY`

## Base de données Supabase
Tables :

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  email text not null,
  stripe_session_id text unique not null,
  review_token uuid unique default gen_random_uuid(),
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  rating int check (rating between 1 and 5),
  comment text,
  author_email text,
  photos jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  is_approved boolean default true
);

alter table reviews enable row level security;
create policy read_public on reviews for select to anon using (is_approved = true);
```

Storage : créez un bucket **`reviews-photos`** (public read).

## Webhook Stripe
Ajoutez un endpoint **`/.netlify/functions/stripe-webhook`** pour l’événement `checkout.session.completed`.
Passez `metadata.product_id` lorsque vous créez la session/Payment Link.

## Formulaire d’avis
Le formulaire s’affiche lorsque l’URL contient `?token=XXXX` (envoyé au client après achat).  
L’utilisateur peut ajouter **jusqu’à 3 photos** (5 Mo max chacune).

---
Fichier régénéré 2025-08-10T16:47:53.837149.
