import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  game: any;
  gameOver = false;
  gameId: any;

  constructor(private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.fetchDb();
    });
  }

  newGame() {
    this.game = new Game();
  }

  fetchDb() {
    this.firestore // Gets the FirestoreDb
      .collection('games') // Gets the Collection
      .doc(this.gameId) // Gets the Document
      .valueChanges()
      .subscribe((game: any) => {
        this.game.stack = game.stack;
        this.game.players = game.players;
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCard = game.playedCard;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;
      });
  }

  pickCard() {
    if (!this.game.pickCardAnimation && !this.gameOver && this.game.players.length > 0) {
      this.nextCard();
      this.nextPlayer();
      this.checkForGameOver();
      setTimeout(() => {
        this.pushPlayedCard();
      }, 1000);
      this.saveGame();
    } else {
      alert('add a Player first');
    }
  }

  nextCard() {
    this.game.currentCard = this.game.stack.pop(); // Deletes the Picked card from Json
    this.game.pickCardAnimation = true; // Enable the Cardanimation
  }

  nextPlayer() {
    this.game.currentPlayer++; // Picks the next player out from the players Array
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length; // Sets currentPlayer back to 0 when its bigger than the Array Length
  }

  checkForGameOver() {
    if (this.game.playedCard.length > 50) {
      this.gameOver = true; // Sets gameOver on true
    }
  }

  pushPlayedCard() {
    this.game.playedCard.push(this.game.currentCard); // push currentCard in playedCard Array
    this.game.pickCardAnimation = false; // sets Cardanimation back on False
    this.saveGame();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    this
      .firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson())
  }
}