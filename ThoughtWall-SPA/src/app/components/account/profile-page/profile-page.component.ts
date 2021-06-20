import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ProfileService } from '../_services/profile.service';
import { ModelProfile } from 'app/components/account/_models/ModelProfile';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';
import { BookingStatusDialogComponent } from './booking-status-dialog.component';
import { FormGroup } from '@angular/forms';
import { BookingService } from '../_services/booking.service';
import { ModelBooking, ModelBookingCreate } from '../_models/ModelBooking';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  template: `
    <div *ngIf="userProfileData; else loadingSpinner">
      <mat-card>
        <h1>{{ userProfileData?.username | titlecase }}'s Profile</h1>
        <button mat-flat-button *ngIf="canEdit" color="{{bookingsEnabled ? 'accent' : 'warn'}}" (click)="openBookingStatusDialog()">Bookings {{ bookingsEnabled ? 'Open' : 'Closed'}}</button>
        </mat-card>

        <mat-card style="min-height: 40vh">
          <mat-tab-group style="height: 100% !important">
            <!-- PROFILE TAB -->
            <mat-tab label="Profile"><br />
              <button mat-icon-button *ngIf="canEdit" (click)="openEditDialog()" style="float: right;" color="accent">
                <mat-icon aria-hidden="false">edit</mat-icon>
              </button>
              <div>
                <h4 color="accent">Bio</h4>
                <span>{{ userProfileData?.bio }}</span>
              </div><br />
              <div class="flexContainer">
                <div class="flexItem">
                  <h4>Country</h4>
                  <span>{{ userProfileData?.country }}</span>
                </div>
                <div class="flexItem">
                  <h4>DoB</h4>
                  <span>{{ userProfileData?.dob | date: "dd/MM/yyyy" }}</span>
                </div>
              </div>
            </mat-tab>
            <!-- POSTS TAB -->
            <mat-tab label="Posts"><br/>
              <div class="flexContainer">
                <div class="flexItem">
                  <h4><u>Threads</u></h4>
                  <ul>
                    <li *ngFor="let thread of userProfileData?.threads"><b class="threadLink"
                        [routerLink]="['/thread', thread.id]">{{ thread.title }}</b>
                      ({{ thread.timeStamp | date: "mediumDate" }})</li>
                  </ul>
                </div>
                <div class="flexItem">
                  <h4><u>Comments</u></h4>
                  <ul>
                    <li *ngFor="let comment of userProfileData?.comments">
                      <b class="threadLink" [routerLink]="['/thread', comment.threadId]">[{{ comment.threadId }}]</b>&nbsp;
                      <i>"{{ comment.body }}"</i> ({{ comment.timeStamp | date: "mediumDate" }})</li>
                  </ul>
                </div>
              </div>
            </mat-tab>
            <!-- THREADS TAB -->
            <mat-tab label="Bookings"><br/>
              <div *ngIf="canEdit; else bookingForm">
                <div *ngIf="allBookings | async as bookings">
                  Bookings:
                  <p *ngFor="let created of bookings.created">
                    Booking with {{ created.bookedWithUser.username | titlecase }} on {{ created.requestedDT | date:'medium'}}
                  </p>
                  
                </div>
              </div>
              <!-- Booking Form -->
              <ng-template #bookingForm>
                <p>Please select your preferred date and time</p>
                <form [formGroup]="form" (submit)="test()">
                  <mat-form-field color="accent" appearance="fill">
                    <mat-label>Choose a date</mat-label>
                    <input matInput formControlName="date" [matDatepicker]="picker">
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker [dateClass]="dateClass" #picker></mat-datepicker>
                  </mat-form-field> &nbsp;&nbsp;&nbsp;
                  <mat-form-field color="accent">
                    <mat-label>Time</mat-label>
                    <input matInput formControlName="time" type="time" id="appt" name="appt" min="09:00" max="18:00" required>
                  </mat-form-field><br/>
                  <button mat-flat-button type="submit" color="accent">Submit</button>
                </form>
              </ng-template>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
    </div>

    <ng-template #loadingSpinner>
      <mat-spinner color="accent"></mat-spinner>
    </ng-template>

  `,
  styles: [`
    .threadLink:hover {
      cursor: pointer;
      color: rgb(119, 210, 235);
    }

    .flexContainer {
      max-width: 1000px;
      display: flex;
      margin: 10px auto;
    }
    .flexItem {
      flex-grow: 1;
      justify-content: center;
      align-items: flex-start;
    }
    h4 {
      margin-top: 0px;
      margin-bottom: 5px;
    }
  `],
})

export class ProfilePageComponent implements OnInit {
  userProfileData: ModelProfile;
  routeProfile: string;
  form: FormGroup;
  allBookings: Observable<ModelBooking[]>;

  get canEdit() {
    return this.accountService.getUniqueName === this.routeProfile;
  }
  get bookingsEnabled() {
    return this.userProfileData.bookingsEnabled;
  }

  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getData();
    this.form = this.bookingService.createForm();

    this.allBookings = this.bookingService.getAllBookings();
  }

  getData() {
    this.routeProfile = this.route.snapshot.paramMap.get('user');
    this.profileService.getProfileData(this.routeProfile).subscribe((data) => {
      this.userProfileData = data;
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, { minWidth: '40vw', data: this.userProfileData });

    dialogRef.afterClosed().subscribe((result: ModelProfile) => {
      if (result != null) {
        this.userProfileData.bio = result.bio;
      }
    });
  }

  openBookingStatusDialog() {
    const dialogRef = this.dialog.open(BookingStatusDialogComponent, { minWidth: '20vw', data: this.userProfileData });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result != null) {
        this.userProfileData.bookingsEnabled = result;
      }
    });
  }

  test() {
    console.log(this.form.value.date);
    const newDateFormat = new Date(this.form.value.date)
      .setHours(this.form.value.time.slice(0, 2), this.form.value.time.slice(3, 5));

    console.log(new Date(newDateFormat));

    const reqForm: ModelBookingCreate = {
      bookedWithUserId: this.userProfileData.id,
      requestedDT: new Date(newDateFormat),
    };

    this.bookingService.createBooking(reqForm).subscribe(() => {
      console.log("Booked!");
    });
  }
}
