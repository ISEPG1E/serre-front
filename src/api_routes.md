# Documentation des routes API

## Utilisateurs

### GET `/api/users`
- **Description** : Récupère la liste de tous les utilisateurs.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "username": "jdupont",
          "email": "jdupont@example.com",
          "first_name": "Jean",
          "last_name": "Dupont",
          "created_at": "2024-06-01 08:00:00",
          "updated_at": "2024-06-01 08:00:00"
        },
        ...
      ]
    }
    ```

### POST `/api/users`
- **Description** : Crée un nouvel utilisateur.
- **Entrée** (JSON) :
    ```json
    {
      "username": "nouvelutilisateur",
      "email": "email@example.com",
      "password": "motdepasse",
      "first_name": "Prénom",
      "last_name": "Nom"
    }
    ```
- **Sortie** (succès) :
    ```json
    {
      "success": true,
      "data": {
        "message": "User created successfully"
      }
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "success": false,
      "error": "User creation failed"
    }
    ```

---

## Authentification

### POST `/api/login`
- **Description** : Authentifie un utilisateur.
- **Entrée** (JSON) :
    ```json
    {
      "username": "utilisateur",
      "password": "motdepasse"
    }
    ```
- **Sortie** (succès) :
    ```json
    {
      "success": true,
      "data": {
        "message": "Login successful"
      }
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "success": false,
      "error": "Invalid credentials"
    }
    ```

---

## Légumes

### GET `/api/vegetables`
- **Description** : Récupère la liste de tous les légumes.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "Tomate",
          "emoji": "🍅",
          "duration": "3-5 mois",
          "average_water_consumption": 2.5,
          "created_at": "2024-06-01 08:00:00"
        },
        ...
      ]
    }
    ```

### POST `/api/vegetables`
- **Description** : Ajoute un nouveau légume.
- **Entrée** (JSON) :
    ```json
    {
      "name": "Radis",
      "emoji": "🌶️",
      "duration": "1-2 mois",
      "average_water_consumption": 1.1
    }
    ```
- **Sortie** (succès) :
    ```json
    {
      "success": true,
      "data": {
        "message": "Légume ajouté avec succès"
      }
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "success": false,
      "error": "Erreur lors de l'ajout du légume"
    }
    ```

---

## Capteurs

### GET `/api/temperature`
- **Description** : Récupère toutes les mesures de température.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "val": 21.5,
          "created_at": "2024-06-01 08:00:00"
        },
        ...
      ]
    }
    ```

### GET `/api/temperature/latest`
- **Description** : Récupère la dernière mesure de température.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "val": 21.9,
        "created_at": "2024-06-02 12:00:00"
      }
    }
    ```

### POST `/api/temperature`
- **Description** : Insère une nouvelle mesure de température.
- **Entrée** (JSON) :
    ```json
    {
      "val": 22.7
    }
    ```
- **Sortie** (succès) :
    ```json
    {
      "success": true,
      "data": {
        "message": "Valeur insérée"
      }
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "success": false,
      "error": "Valeur manquante"
    }
    ```

### POST `/api/temperature/insert-from-capteur`
- **Description** : Lit la valeur du capteur (via le port série) et l’insère dans la base.
- **Entrée** : aucune
- **Sortie** (succès) :
    ```json
    {
      "message": "Valeur insérée automatiquement",
      "valeur": 22.7
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "error": "Aucune donnée reçue"
    }
    ```

---

### GET `/api/humidity`
- **Description** : Récupère toutes les mesures d'humidité.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "val": 45.2,
          "created_at": "2024-06-01 08:00:00"
        },
        ...
      ]
    }
    ```

### GET `/api/humidity/latest`
- **Description** : Récupère la dernière mesure d'humidité.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "val": 46.3,
        "created_at": "2024-06-02 12:00:00"
      }
    }
    ```

---

### GET `/api/light`
- **Description** : Récupère toutes les mesures de luminosité.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "val": 300.0,
          "created_at": "2024-06-01 08:00:00"
        },
        ...
      ]
    }
    ```

### GET `/api/light/latest`
- **Description** : Récupère la dernière mesure de luminosité.
- **Entrée** : aucune
- **Sortie** :
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "val": 900.0,
        "created_at": "2024-06-02 12:00:00"
      }
    }
    ```

---

### GET `/api/capteur`
- **Description** : Lit la valeur actuelle du capteur (sans insertion en base).
- **Entrée** : aucune
- **Sortie** (succès) :
    ```json
    {
      "valeur": 22.7
    }
    ```
- **Sortie** (erreur) :
    ```json
    {
      "erreur": "Aucune donnée reçue"
    }
    ```

---

## Format des erreurs

- **Sortie** (erreur générique) :
    ```json
    {
      "success": false,
      "error": "Message d'erreur"
    }
    ```