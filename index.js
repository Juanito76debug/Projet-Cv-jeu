window.addEventListener("DOMContentLoaded", () => {
  const basketball = document.getElementById("basketball");
  const rightBasket = document.getElementById("rightBasket");
  const scorePlayer1Element = document.getElementById("scorePlayer1");
  const scoreboard = document.getElementById("scoreboard");

  // Initialisation du terrain de basket
  const basketballCourt = initializeBasketballCourt();
  console.log('Terrain de basket initialisé :', basketballCourt);

  // Position initiale du ballon
  let ballPosition = {
    top: 400,  // Valeur en pixels pour la position initiale en haut,
    left: 400,  // Valeur en pixels pour la position initiale à gauche,
  };
  console.log('Position initiale du ballon :', ballPosition);

  // Position initiale du ballon après le lancer
  const initialBallPosition = {
    top: 400,  // Valeur en pixels pour la position initiale en haut
    left: 400  // Valeur en pixels pour la position initiale à gauche
  };

  let ballVelocity = {
    x: 0,
    y: 0,
  };

  let totalScorePlayer1 = 0;
  const scoreToWin = 21;

  // Gravité pour simuler la chute du ballon
  const gravity = 0.99;
  const velocity = 0.25;

  document.addEventListener("keydown", (event) => {
    console.log("Touche enfoncée : ", event.key);
    switch (event.key) {
      case "ArrowLeft":
        // Déplacer le ballon vers la gauche
        if (ballPosition.left > 0) {
          ballVelocity.x -= 0.1;
          console.log("Déplacer le ballon vers la gauche. Nouvelle vélocité X :", ballVelocity.x);
        }
        break;
      case "ArrowRight":
        // Déplacer le ballon vers la droite
        ballVelocity.x += 0.1;
        console.log("Déplacer le ballon vers la droite. Nouvelle vélocité X :", ballVelocity.x);
        break;
      case "ArrowUp":
        // Déplacer le ballon vers le haut
        ballVelocity.y -= 0.1;
        console.log("Déplacer le ballon vers le haut. Nouvelle vélocité Y :", ballVelocity.y);
        break;
      case "ArrowDown":
        // Déplacer le ballon vers le bas
        ballVelocity.y += 0.1;
        console.log("Déplacer le ballon vers le bas. Nouvelle vélocité Y :", ballVelocity.y);
        break;
      case " ":
        // Lancer le ballon
        throwBall();
        console.log("Lancer le ballon.");
        break;
      default:
        break;
    }
  });

  const distanceToBasket = 4.6;

  function debugCollision() {
    if (isCollision(ballPosition.left, ballPosition.top, basketball.clientWidth, basketball.clientHeight, rightBasket)) {
      console.log("Collision avec le panier. Position du ballon :", ballPosition);
    }
  }

  function throwBall() {
    console.log("Début de la fonction throwBall.");

    // Ajouter une vérification pour que le ballon reste à l'intérieur du terrain
    ballPosition.left += ballVelocity.x;
    ballPosition.top += ballVelocity.y;

    // Limiter la position du ballon pour rester à l'intérieur du terrain
    ballPosition.left = Math.max(
      0,
      Math.min(basketballCourt.clientWidth - basketball.clientWidth, ballPosition.left)
    );
    ballPosition.top = Math.max(
      0,
      Math.min(basketballCourt.clientHeight - basketball.clientHeight, ballPosition.top)
    );

    // Vérifier la collision avec le panier (rightBasket)
    if (isCollision(ballPosition.left, ballPosition.top, basketball.clientWidth, basketball.clientHeight, rightBasket)) {
      // Mesurer la distance entre le ballon et le panier
      const distance = Math.sqrt(
        Math.pow(ballPosition.left - rightBasket.offsetLeft, 2) +
        Math.pow(ballPosition.top - rightBasket.offsetTop, 2)
      );

      // La balle atteint le panier, réinitialiser les vélocités
      ballVelocity.x = 1;
      ballVelocity.y = 1;
      console.log("Collision avec le panier. Réinitialisation des vélocités.");

      if (distance < distanceToBasket) {
        const angle = Math.atan2(rightBasket.offsetTop - ballPosition.top, rightBasket.offsetLeft - ballPosition.left);
        ballPosition.left = rightBasket.offsetLeft - distanceToBasket * Math.cos(angle);
        ballPosition.top = rightBasket.offsetTop - distanceToBasket * Math.sin(angle);

        // Inverser la direction verticale pour simuler un rebond au sol
        ballVelocity.y *= -1;

        // Mettre à jour la position du ballon dans le style
        basketball.style.top = `${ballPosition.top}px`;
        basketball.style.left = `${ballPosition.left}px`;

        // Ajouter ici le code à exécuter lorsque le ballon touche le panier
        handleCollision();

        // Ajouter un point au score du joueur
        totalScorePlayer1++;
        console.log("Panier réussi ! Nouveau score :", totalScorePlayer1);

        // Mettre à jour l'affichage du score
        scorePlayer1Element.innerText = totalScorePlayer1;

        // Vérifier si le joueur a atteint le score requis pour gagner
        if (totalScorePlayer1 === scoreToWin) {
          console.log("Le joueur a gagné !");
          // Ajouter ici le code à exécuter en cas de victoire
        }

        // Mettre à jour le scoreboard
        updateScoreboard();

        // Réinitialiser la position du ballon après un court délai (ajustez selon vos besoins)
        setTimeout(() => {
          resetBall();
          console.log("Timeout pour réinitialiser la position du ballon après un panier.");
        }, 1000);

        // Arrêter la propagation de la fonction après la collision
        //return;
      }
    }

    // Arrêter le mouvement du ballon une fois qu'il atteint le sol
    if (ballPosition.top >= basketballCourt.clientHeight - basketball.clientHeight) {
      ballVelocity.x = 0;
      ballVelocity.y = 0;
      ballPosition.top = basketballCourt.clientHeight - basketball.clientHeight;
    }

    // Vérifier les rebonds sur les bords du terrain
    if (
      ballPosition.left <= 0 ||
      ballPosition.left >= basketballCourt.clientWidth - basketball.clientWidth
    ) {
      // Inverser la direction horizontale en cas de rebond sur les bords horizontaux
      ballVelocity.x *= -1;
      console.log("Rebond sur les bords horizontaux. Inversion de la direction horizontale. Nouvelle vélocité X :", ballVelocity.x);
    }

    if (
      ballPosition.top <= 0 ||
      ballPosition.top >= basketballCourt.clientHeight - basketball.clientHeight
    ) {
      // Inverser la direction verticale en cas de rebond sur les bords verticaux
      ballVelocity.y *= -1;
      console.log("Rebond sur les bords verticaux. Inversion de la direction verticale. Nouvelle vélocité Y :", ballVelocity.y);
    }

    console.log(
      "Position left balle : ",
      ballPosition.left,
      "Position haut balle : ",
      ballPosition.top
    );

    // Mettre à jour la position du ballon dans le style
    basketball.style.top = `${ballPosition.top}px`;
    basketball.style.left = `${ballPosition.left}px`;

    // Appeler la fonction de débogage pour vérifier la collision avec le panier
    debugCollision();

    // Continuer l'animation
    requestAnimationFrame(throwBall);

    console.log("Fin de la fonction throwBall.");
  }

  function handleCollision() {
    // Ajouter ici le code à exécuter lorsque le ballon touche le panier
    console.log("Collision avec le panier. Exécution de handleCollision.");
    // Vous pouvez effectuer des actions spécifiques lors de la collision ici
    // Par exemple, changer la couleur du panier, jouer un son, etc.
  }

  function resetBall() {
    // Réinitialiser la position initiale du ballon et supprimer tout effet visuel de collision avec le panier
    ballPosition = { ...initialBallPosition };

    // Mettre à jour la position du ballon dans le style
    basketball.style.top = `${ballPosition.top}px`;
    basketball.style.left = `${ballPosition.left}px`;

    // Ajouter d'autres actions de réinitialisation si nécessaire
    console.log("Réinitialisation de la position du ballon.");
  }

  // Fonction d'initialisation du terrain de basket
  function initializeBasketballCourt() {
    const basketballCourt = document.getElementById("basketball-court");
    // Ajouter des éléments, définir des propriétés, etc., selon vos besoins
    return basketballCourt;
  }

  // Fonction pour vérifier la collision entre le ballon et un élément (panier)
  function isCollision(ballLeft, ballTop, ballWidth, ballHeight, element) {
    const elementRect = element.getBoundingClientRect();
    // Définir une marge de proximité entre le ballon et l'élément (ajustez selon vos besoins)
    const proximityMargin = 5;
  
    // Calculer les coordonnées du rectangle de collision du ballon
    const ballCollisionRect = {
      left: ballLeft + proximityMargin,
      right: ballLeft + ballWidth - proximityMargin,
      top: ballTop + proximityMargin,
      bottom: ballTop + ballHeight - proximityMargin,
    };
  
    // Calculer les coordonnées du rectangle de collision de l'élément
    const elementCollisionRect = {
      left: elementRect.left + proximityMargin,
      right: elementRect.right - proximityMargin,
      top: elementRect.top + proximityMargin,
      bottom: elementRect.bottom - proximityMargin,
    };
  
    // Vérifier la collision entre les deux rectangles
    const collision =
      ballCollisionRect.left < elementCollisionRect.right &&
      ballCollisionRect.right > elementCollisionRect.left &&
      ballCollisionRect.top < elementCollisionRect.bottom &&
      ballCollisionRect.bottom > elementCollisionRect.top;
  
    console.log("Vérification de la collision :", collision);
    return collision;
  }

  function updateScoreboard() {
    // Ajouter ici le code pour mettre à jour le scoreboard
    console.log("Mise à jour du scoreboard. Nouveau score :", totalScorePlayer1);
  }
});