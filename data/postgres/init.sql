
-- Création de la base Keycloak (si elle n'existe pas)
CREATE DATABASE keycloak_db;

-- Création de la base Railway
CREATE DATABASE railway_db;

-- Optionnel : donner les droits à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO ${POSTGRES_USER};
GRANT ALL PRIVILEGES ON DATABASE railway_db TO ${POSTGRES_USER};
