# 🥦 Food Surplus & Community Share

Plateforme web MERN complète (MongoDB, Express, React, Node.js) connectant les commerces alimentaires (restaurants, boulangeries, primeurs, supermarchés) avec des associations caritatives ou des particuliers afin d'éradiquer le gaspillage alimentaire.

---

## 🌟 Fonctionnalités Clés

### 1. 🗺️ Carte Interactive & Géolocalisation (Leaflet.js)
- **Détection automatique de la position GPS** via la Geolocation API du navigateur.
- **Marqueurs dynamiques et colorés** selon le type d'aliment (🥐 Boulangerie, 🍲 Plats chauds, 🍏 Fruits & Légumes, 🧀 Laiterie, 📦 Épicerie).
- **Rayon de recherche paramétrable** de 1 à 30 km avec visualisation circulaire sur la carte.
- Pop-up détaillée avec aperçu du panier et bouton de réservation instantané.

### 2. ⏳ Food Cards & Compte à Rebours (Urgence anti-gaspillage)
- **Countdown timer en direct** indiquant le temps restant avant la fin de la fenêtre de retrait.
- **Badges de distance** précis calculés via les index géospatiaux MongoDB.
- Tarification transparente : prix d'origine barré, prix réduit solidaire ou mention **GRATUIT**.

### 3. 🔐 Authentification & Rôles Multiples (RBAC)
- Authentification sécurisée par **JWT** et **Cookies HttpOnly**.
- **Donneur (Commerçant)** : publication de surplus, gestion des invendus, validation instantanée des retraits.
- **Bénéficiaire (Association / Particulier)** : exploration géographique, filtres (gratuit/payant, catégorie), réservation et génération du bon de retrait.
- **Code de retrait unique (FS-XXXXX)** généré à chaque commande pour garantir la traçabilité.

### 4. 🌍 Indexation Géospatiale MongoDB (`2dsphere`)
- Utilisation de l'agrégation `$geoNear` et du format GeoJSON `Point [longitude, latitude]` pour des calculs de distance euclidienne/sphérique ultra-rapides.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** (v18+)
- **MongoDB** local (`mongodb://127.0.0.1:27017`) ou cluster MongoDB Atlas.

### 1. Lancement du Backend
```bash
cd server
npm install
# (Optionnel) Charger les données de test avec coordonnées GPS réelles :
node src/seed.js
npm run dev
```
Le serveur démarrera sur `http://localhost:5000` (API : `http://localhost:5000/api/v1`).

### 2. Lancement du Frontend
```bash
cd client
npm install
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 🔑 Comptes de Test Pré-configurés (Seed)

| Rôle | Email | Mot de passe | Description |
| :--- | :--- | :--- | :--- |
| **Donneur** | `boulangerie@moulin.com` | `password123` | Boulangerie artisanale (Paniers viennoiseries & pains) |
| **Donneur** | `trattoria@bellaroma.com` | `password123` | Restaurant italien (Plats cuisinés du jour) |
| **Donneur** | `bio@natureco.com` | `password123` | Supermarché Bio (Caisses fruits & légumes gratuits) |
| **Bénéficiaire** | `solidarite@partage.org` | `password123` | Association caritative locale |
| **Admin** | `admin@foodsurplus.org` | `adminpassword123` | Administrateur plateforme |

---

## 📡 Endpoints Clés de l'API REST

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Inscription avec coordonnées géographiques |
| `POST` | `/api/v1/auth/login` | Connexion et émission du cookie JWT |
| `GET` | `/api/v1/listings/nearby?lat=48.85&lng=2.35&radius=10` | **Recherche géospatiale `$geoNear` 2dsphere** |
| `POST` | `/api/v1/listings` | Création d'une offre de surplus (Donneur) |
| `POST` | `/api/v1/reservations` | Réservation d'un panier & émission du code unique |
| `POST` | `/api/v1/reservations/claim` | Validation du code par le commerçant |
