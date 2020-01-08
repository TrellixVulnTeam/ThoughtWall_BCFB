import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../_services/navbar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  keyword: string;

  constructor(private router: Router, private navbarService: NavbarService ) {}

  hitHome() {
    this.navbarService.changeNav(1);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  onSearchSubmit() {
    this.router.navigate(['/search', this.keyword]);
  }
  ngOnInit() {
  }

}
