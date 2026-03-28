import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './callback.html',
  styleUrl: './callback.scss',
})
export class Callback implements OnInit{
  
  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    this.authService.loadUserInfo();
    // setTimeout(() => {
    //   this.router.navigate(['/dashboard']);
    // }, 1000);
  }
}


