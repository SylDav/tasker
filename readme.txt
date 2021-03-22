Pour pouvoir utiliser l'application, il faut :
    - Faire la commande suivante :
        composer install
    - Configurer la base de données. 
        Pour celle, mettre à jour le fichier .env.local avec les données de connexion de votre base de données.
        - Faire les commandes :
            php bin/console doctrine:database:create
            php bin/console make:migration
            php bin/console doctrine:migrations:migrate
