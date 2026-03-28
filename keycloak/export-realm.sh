#!/bin/bash

#########################################
# Keycloak Realm Export Script
# Works with Keycloak Quarkus (17+)
#########################################

# === Configuration ===
KEYCLOAK_DIR="/opt/keycloak"             # Emplacement d'installation Keycloak
EXPORT_DIR="$KEYCLOAK_DIR/data/export"   # Dossier de sortie
REALM_NAME="fleet-management"            # Nom du realm à exporter
USERS_MODE="realm_file"                  # Options : skip | realm_file | same_file | different_files

# === Script ===

echo "----------------------------------------------"
echo " Exporting Keycloak Realm: $REALM_NAME"
echo " Output directory: $EXPORT_DIR"
echo " Users export mode: $USERS_MODE"
echo "----------------------------------------------"

# Créer dossier export si nécessaire
mkdir -p "$EXPORT_DIR"

# Exécuter l’export
"$KEYCLOAK_DIR/bin/kc.sh" export \
  --dir "$EXPORT_DIR" \
  --realm "$REALM_NAME" \
  --users "$USERS_MODE"

# Vérification
EXPORT_FILE="$EXPORT_DIR/$REALM_NAME-realm.json"

if [ -f "$EXPORT_FILE" ]; then
    echo "✅ Export OK : $EXPORT_FILE"
else
    echo "❌ Échec de l'export — vérifier les logs"
fi

echo "----------------------------------------------"
echo "Terminé."
