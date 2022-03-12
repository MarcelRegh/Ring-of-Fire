import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.scss']
})
export class GameoverComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  restartGame() {
    this.router.navigateByUrl('/');
  }

}
