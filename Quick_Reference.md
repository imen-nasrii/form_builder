# FormBuilder Pro - Référence Rapide

## 🔑 Comptes de Test
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@formcraft.pro | admin123 |
| Utilisateur | testuser@example.com | testpass123 |

## 🎯 Actions Principales

### Dashboard
- **Nouveau Programme :** Bouton "New Program"
- **Recherche :** Barre de recherche en temps réel
- **Filtres :** Par statut, priorité, assigné

### Form Builder
- **Menu Actions :** Guide, Import, Export, Components, Clear, Save
- **Palette :** Composants glisser-déposer (gauche)
- **Construction :** Zone de création (centre)
- **Propriétés :** Configuration (droite)

### Assistant IA "Alex"
- **Chat :** Pose des questions en français/anglais
- **Upload DFM :** Analyse de fichiers Delphi
- **Génération :** ACCADJ, BUYTYP, PRIMNT, SRCMNT
- **Suggestions :** Boutons de génération rapide

### Kanban Board
- **Colonnes :** To Do → In Progress → Review → Completed
- **Drag & Drop :** Glisser les cartes entre colonnes
- **Détails :** Clic sur carte pour modifier
- **Résultats :** Upload de fichiers et commentaires

## 🏗 Types de Composants

### Inputs
- `TEXT` - Saisie de texte simple
- `EMAIL` - Email avec validation
- `PASSWORD` - Mot de passe masqué
- `NUMBER` - Nombre avec contrôles
- `TEXTAREA` - Texte multiligne

### Sélection
- `SELECT` - Liste déroulante
- `RADIO` - Boutons radio
- `CHECKBOX` - Cases à cocher
- `SWITCH` - Interrupteur on/off

### Data
- `GRIDLKP` - Grille de lookup
- `LSTLKP` - Liste de lookup
- `DATEPICKER` - Sélecteur de date
- `FILEPICKER` - Sélecteur de fichier

### Layout
- `LABEL` - Étiquette de texte
- `SEPARATOR` - Ligne de séparation
- `SPACER` - Espace vide

### Actions
- `BUTTON` - Bouton d'action
- `SUBMIT` - Bouton de validation

## ⚡ Raccourcis Clavier

| Action | Raccourci |
|--------|-----------|
| Sauvegarder | Ctrl + S |
| Nouveau | Ctrl + N |
| Copier composant | Ctrl + C |
| Coller composant | Ctrl + V |
| Supprimer | Delete |
| Annuler | Ctrl + Z |
| Mode plein écran | F11 |

## 🎨 Personnalisation

### Thèmes
- **Clair :** Interface blanche/grise
- **Sombre :** Interface noire/grise
- **Basculer :** Icône soleil/lune

### Propriétés Communes
- **Width :** Largeur du composant
- **Spacing :** Espacement autour
- **Required :** Champ obligatoire
- **Inline :** Affichage en ligne
- **Outlined :** Bordure visible

### Validation
- **MinLength :** Longueur minimale
- **MaxLength :** Longueur maximale
- **Pattern :** Expression régulière
- **Custom :** Validation personnalisée

## 📊 Statuts & Priorités

### Statuts de Tâche
- `todo` - À faire
- `in-progress` - En cours
- `review` - En révision
- `completed` - Terminé

### Niveaux de Priorité
- `low` - Basse (vert)
- `medium` - Moyenne (jaune)
- `high` - Haute (rouge)

## 💾 Import/Export

### Format JSON
```json
{
  "formMetadata": {
    "menuId": "FORM_ID",
    "label": "Nom",
    "formWidth": "700px",
    "layout": "PROCESS"
  },
  "fields": [
    {
      "Type": "TEXT",
      "Label": "Nom du champ",
      "DataField": "field_name",
      "Required": true
    }
  ]
}
```

### Extensions Supportées
- `.json` - Configuration de formulaire
- `.dfm` - Fichiers Delphi (upload vers IA)

## 🔧 Dépannage Express

### Problème : "Programme ne se sauvegarde pas"
1. Vérifier connexion internet
2. Tous les champs obligatoires remplis ?
3. Essayer Menu Actions → Save

### Problème : "Composant ne s'affiche pas"
1. Actualiser la page (F5)
2. Vérifier mode clair/sombre
3. Réduire/étendre palette composants

### Problème : "IA ne répond pas"
1. Attendre 10-15 secondes
2. Reformuler la question
3. Vérifier connexion internet

### Problème : "Erreur 401 Unauthorized"
1. Se reconnecter
2. Vider cache navigateur
3. Utiliser comptes de test fournis

## 📱 Navigation Mobile

### Interface Adaptative
- Palette rétractable
- Boutons optimisés tactile
- Menus déroulants
- Zoom automatique

### Gestes Tactiles
- **Tap :** Sélectionner
- **Long press :** Menu contextuel
- **Swipe :** Changer de statut Kanban
- **Pinch :** Zoom (construction)

## 🎯 Bonnes Pratiques

### Nommage
- **MenuID :** Format UPPERCASE_SNAKE
- **Labels :** Descriptifs et clairs
- **DataFields :** snake_case recommandé

### Organisation
- Grouper composants similaires
- Utiliser séparateurs pour sections
- Noms de programmes explicites
- Comments pour logique complexe

### Performance
- Éviter trop de composants GRIDLKP
- Optimiser taille des formulaires
- Sauvegarder régulièrement
- Exporter backups importants

---

**Astuce :** Utilisez le bouton "Guide" dans le menu Actions pour une aide contextuelle !

**Support :** Contactez l'équipe technique en cas de problème persistant.