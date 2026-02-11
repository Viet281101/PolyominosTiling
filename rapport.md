# Pavages de Polyominos en JavaScript

Projet réalisé par **NGUYEN VIET** et **GEOFFROY DAMIEN**.

## Remerciements

Nous remercions Monsieur **Nicolas JOUANDEAU** pour son accompagnement et ses
conseils qui nous ont permis de réaliser ce document et d'appréhender ce projet tuteuré.
Nous exprimons également notre gratitude envers Monsieur **Farès BELHADJ** pour avoir mis
à notre disposition son document, nous permettant ainsi de fournir un rendu professionnel.

## I) <ins>Introduction</ins>

Ce document représente un état de l'art approfondi sur le sujet des pavages de polyominos. Cette étude s'inscrit dans le cadre de notre projet tuteuré, mené au sein de notre cursus à l’Université Paris 8 Vincennes - Saint-Denis, pendant notre troisième année. Ce projet tuteuré se décline en deux phases distinctes réparties sur les deux semestres. La première phase consiste en une recherche et réflexion approfondie, aboutissant à la rédaction de cet état de l'art que vous êtes en train de lire. La seconde partie de notre projet implique la mise en pratique des connaissances acquises, avec la concrétisation du projet dans son ensemble.

Le sujet qui nous a été attribué est particulièrement captivant. Il nous offre l'opportunité d'explorer les domaines des mathématiques à travers l'étude des polyominos. Ce sont des formes géométriques, constituées de l'assemblage de carrés unitaires connectés entre eux, pouvant varier en taille allant d’une taille 1 à une limite indéterminée. Les polyominos ont gagné en popularité au cours du 20e siècle, tant en raison des problèmes mathématiques complexes qu'ils suscitent que grâce à la diffusion mondiale du jeu Tetris. Ce dernier, basé sur des pièces de polyominos tombant sur une grille de dimensions finies, a contribué à populariser ces formes simples. Le jeu consiste à compléter des lignes en largeur pour augmenter le score du joueur.

Ce projet nous offre une perspective unique en nous permettant d'explorer non seulement le domaine des mathématiques, grâce au pavage qui consiste en une disposition régulière d’éléments les uns à-côtés des autres afin d’obtenir une nouvelle forme. Dans le cadre de notre sujet, il s’agit de l'emboîtement des polyominos, mais également celui de l'informatique et de l'algorithmique. Nous mettrons en œuvre nos connaissances, notamment en utilisant JavaScript, un langage de programmation offrant des capacités graphiques avancées tout tout en restant flexible. Sa popularité et sa compatibilité avec les navigateurs web en font un outil idéal pour la visualisation des résultats des algorithmes de pavage. De plus, la syntaxe claire et la facilité de manipulation des objets dans JavaScript faciliteront le processus de conception et de mise en œuvre de notre programme.

Tout au long de ce document, nous allons plonger dans les aspects théoriques des pavages de polyominos, en préparation à la phase pratique de notre projet tuteuré dans laquelle nous exploiteront pleinement les fonctionnalités de JavaScript pour concrétiser nos idées et visualiser les résultats obtenus.

## II) <ins>Exploration des Types de Polyomino en 2D</ins>

Dans ce chapitre, nous explorerons les divers polyominos existants, offrant ainsi une compréhension approfondie de l'enjeu de notre projet tuteuré. Pour ce faire, nous reverrons les fondements même d'un polyomino, cela nous amènera à voir leurs caractéristiques essentielles, tout en élargissant notre analyse pour examiner les nombreuses variantes qui existent pour certains polyominos spécifiques. Cette démarche nous permettra de comprendre les défis et les problèmes liés à ces derniers, nous permettant d’avoir un point de vue global des possibilités et des complexités que nous devrons aborder dans la réalisation de notre projet.

### Introduction aux Polyomino

Avant de poursuivre notre étude, revenons sur la nature même d'un polyomino.

Le terme "polyomino" a été introduit en 1953 par Solomon W. Golomb (Source : [Solomon W. Golomb - Wikipedia](https://en.wikipedia.org/wiki/Solomon_W._Golomb)), un ingénieur et mathématicien célèbre pour ses contributions variées, dont l'invention des "échecodames" 1 et son empreinte laissée grâce à ses travaux sur les polyominos.

L'appellation "polyomino" est dérivée du mot "domino", et le préfixe "poly" peut être substitué par le nombre de parties composant le polyomino en grec. Un polyomino, tel que décrit précédemment, se compose d'un ensemble de carrés connectés entre eux par les bords, le différenciant des autres polyformes tels que ceux formés de répétition pyramides ou des cubes.

Dans le cadre de notre projet tuteuré, nous focalisons notre attention sur les polyominos en raison de leur prédominance et de leur utilisation évidente dans le contexte d’un plan (leurs équivalents tridimensionnels étant les polycubes). En effet, travailler avec des polyominos présente des avantages pratiques, notamment sur le plan 2D. Par rapport aux polyiamondes, qui ont une forme de base triangulaire, les polyominos offrent une plus grande simplicité, réduisant les complications liées aux espaces perdus engendrés par cette forme particulière. D'un autre côté, les formes plus rectangulaires s’avèrent être des équivalents aux polyominos, rendant leur étude moins captivante dans le cadre de notre projet tuteuré.

### Description du pavage
