import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModelToken } from '../../_models/ModelToken';
import { ModelProfile } from 'app/_models/ModelProfile';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.apiUrl + '/profile';
  constructor(private http: HttpClient) { }

  createForm(profile: ModelProfile): FormGroup {
    return new FormGroup({
      id: new FormControl(profile.id),
      username: new FormControl(profile.username),
      bio: new FormControl(profile.bio, [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
      country: new FormControl(profile.country),
      dob: new FormControl(profile.dob),
    });
  }

  getProfileData(username: string): Observable<ModelProfile> {
    return this.http.get<ModelProfile>(this.baseUrl + `?username=${username}`);
  }

  updateProfile(profile: ModelProfile): Observable<ModelProfile> {
    return this.http.put<ModelProfile>(this.baseUrl, profile);
  }
}
