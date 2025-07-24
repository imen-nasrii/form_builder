# FormBuilder Pro - Guide Questions & Réponses

## 🚀 Prise en Main

### Q: Comment accéder à l'application ?
**R:** Utilisez l'un de ces comptes de test :
- **Admin :** admin@formcraft.pro / admin123
- **Utilisateur :** testuser@example.com / testpass123

### Q: Quelle est la différence entre admin et utilisateur ?
**R:** 
- **Admin :** Peut voir tous les programmes, gérer les utilisateurs, assigner des tâches
- **Utilisateur :** Peut créer des programmes et gérer ses tâches assignées

## 📋 Création de Programmes

### Q: Comment créer un nouveau programme ?
**R:** 
1. Cliquez sur "New Program" depuis le dashboard
2. Glissez-déposez des composants depuis la palette de gauche
3. Configurez les propriétés dans le panneau de droite
4. Utilisez le menu "Actions" pour sauvegarder

### Q: Quels types de composants sont disponibles ?
**R:** 
- **Inputs :** TEXT, EMAIL, PASSWORD, NUMBER
- **Selection :** SELECT, RADIO, CHECKBOX, SWITCH
- **Data :** GRIDLKP, LSTLKP, DATEPICKER
- **Layout :** LABEL, SEPARATOR, SPACER
- **Actions :** BUTTON, SUBMIT

### Q: Comment utiliser le système de grille avancé ?
**R:** 
- Cliquez sur les cellules pour les sélectionner
- Glissez des composants directement dans les cellules
- Utilisez les contrôles pour fusionner/diviser les cellules
- Ajustez la taille avec les poignées de redimensionnement

## 🎨 Interface & Navigation

### Q: Où se trouvent les actions principales ?
**R:** Dans le menu déroulant "Actions" en haut :
- **Guide :** Aide rapide
- **Import/Export :** Gestion des fichiers JSON
- **External Components :** Ajouter des composants personnalisés
- **Clear :** Réinitialiser le formulaire
- **Save :** Sauvegarder le travail

### Q: Comment basculer entre les thèmes ?
**R:** Utilisez le bouton soleil/lune dans la barre d'outils pour passer du mode clair au mode sombre.

### Q: Comment accéder au mode plein écran ?
**R:** Cliquez sur l'icône d'agrandissement dans la barre d'outils.

## 🤖 Assistant IA "Alex"

### Q: Comment utiliser l'assistant IA ?
**R:** 
1. Accédez via le menu de navigation "AI Assistant"
2. Tapez vos questions en français ou anglais
3. Alex peut générer des programmes financiers (ACCADJ, BUYTYP, PRIMNT, SRCMNT)
4. Uploadez des fichiers DFM pour analyse automatique

### Q: Quels types de programmes Alex peut-il créer ?
**R:** 
- **ACCADJ :** Programmes d'ajustement comptable
- **BUYTYP :** Systèmes de gestion d'achats
- **PRIMNT :** Interfaces de maintenance primaire
- **SRCMNT :** Modules de recherche et maintenance

### Q: Comment uploader un fichier DFM ?
**R:** 
1. Cliquez sur "Upload DFM" dans l'interface Alex
2. Sélectionnez votre fichier .dfm
3. Alex analyse automatiquement et pose des questions contextuelles
4. Obtenez un JSON de programme généré automatiquement

## 📊 Gestion des Tâches (Kanban)

### Q: Comment fonctionne le tableau Kanban ?
**R:** 
- **To Do :** Nouvelles tâches assignées
- **In Progress :** Tâches en cours
- **Review :** Tâches terminées en attente de validation
- **Completed :** Tâches finalisées

### Q: Comment changer le statut d'une tâche ?
**R:** Glissez-déposez la carte de tâche entre les colonnes ou utilisez les boutons de statut dans les détails de la tâche.

### Q: Comment soumettre un résultat ?
**R:** 
1. Ouvrez les détails de la tâche
2. Cliquez sur "Submit Result"
3. Uploadez vos fichiers
4. Ajoutez des commentaires
5. Changez le statut vers "Review"

## 🔧 Import/Export

### Q: Comment importer un programme existant ?
**R:** 
1. Menu "Actions" → "Import"
2. Sélectionnez votre fichier JSON
3. Prévisualisez le contenu
4. Cliquez "Import Form"

### Q: Comment exporter mon travail ?
**R:** 
1. Menu "Actions" → "Export"
2. Le fichier JSON se télécharge automatiquement
3. Contient : métadonnées, champs, composants personnalisés

### Q: Quel format d'export est supporté ?
**R:** Format JSON standardisé incluant :
- Configuration du formulaire
- Définition des champs
- Propriétés des composants
- Métadonnées d'export

## 🔍 Analytics & Statistiques

### Q: Où voir mes statistiques personnelles ?
**R:** Page "Analytics" dans le menu principal :
- Nombre de programmes créés
- Tâches assignées et statuts
- Graphiques de progression
- Activité récente

### Q: Comment suivre mes performances ?
**R:** Les graphiques analytics montrent :
- Évolution des créations par mois
- Distribution des statuts de tâches
- Temps de completion moyen
- Tendances d'activité

## 🛠 Composants Personnalisés

### Q: Comment créer un composant personnalisé ?
**R:** 
1. Menu "Actions" → "External Components"
2. Onglet "Visual Creator" pour interface graphique
3. Ou "JSON Configuration" pour configuration avancée
4. Testez et validez votre composant

### Q: Format JSON pour composants personnalisés ?
**R:** 
```json
{
  "name": "customInput",
  "label": "Input Personnalisé",
  "icon": "Type",
  "color": "blue",
  "properties": {
    "placeholder": "Texte par défaut",
    "validation": "required",
    "maxLength": 255
  }
}
```

## 🔐 Gestion des Utilisateurs (Admin)

### Q: Comment assigner une tâche ? (Admin uniquement)
**R:** 
1. Page "Dashboard" admin
2. Cliquez sur un programme
3. Bouton "Assign to User"
4. Sélectionnez l'utilisateur et définissez priorité/deadline

### Q: Comment gérer les utilisateurs ? (Admin uniquement)
**R:** 
Page "Admin Dashboard" :
- Voir tous les utilisateurs
- Modifier les rôles
- Gérer les permissions
- Suivre l'activité

## 🚨 Dépannage

### Q: Mon programme ne se sauvegarde pas ?
**R:** 
1. Vérifiez votre connexion internet
2. Essayez le menu "Actions" → "Save"
3. Vérifiez que tous les champs obligatoires sont remplis

### Q: Les composants ne s'affichent pas ?
**R:** 
1. Actualisez la page
2. Vérifiez le mode d'affichage (clair/sombre)
3. Essayez de réduire/étendre la palette de composants

### Q: L'assistant IA ne répond pas ?
**R:** 
1. Vérifiez votre connexion
2. Attendez quelques secondes (traitement IA)
3. Reformulez votre question plus simplement

## 📞 Support

### Q: Comment obtenir de l'aide supplémentaire ?
**R:** 
- Utilisez le bouton "Guide" dans le menu Actions
- Consultez cette FAQ
- Contactez l'équipe de support technique

### Q: Où signaler un bug ?
**R:** Contactez l'équipe de développement avec :
- Description du problème
- Étapes pour reproduire
- Captures d'écran si possible

---

**Dernière mise à jour :** 24 Juillet 2025
**Version :** FormBuilder Pro v2.0