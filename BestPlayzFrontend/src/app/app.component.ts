import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CommentService} from './comment/shared/comment.service';
import {StorageService} from './shared/storage.service';
import {CommentComponent} from './comment/comment.component';
import {ClientModel} from './comment/shared/client.model';
import {FormControl} from '@angular/forms';
import {Socket} from 'ngx-socket-io';
import {loginDto} from './comment/shared/login.dto';
import {WelcomeDto} from './comment/shared/welcome.dto';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Best-Playz-Frontend';
  isLoggedIn = localStorage.length;
  userNickname: string | undefined;
  loggedInUser: ClientModel | undefined;
  loginRequest: boolean | undefined;
  loginFC = new FormControl('');
  unsubscribe$ = new Subject();

  constructor(
    private storageService: StorageService,
    private socket: Socket,
  ) { }

  ngOnInit(): void {
    this.listenForCommentWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        // this.comments = welcome.comments;
        this.loggedInUser = welcome.client;
        this.storageService.saveClient(this.loggedInUser);
        console.log('saved LIU: ', this.loggedInUser.nickname);
        location.reload();

      });
    const oldClient = this.storageService.loadClient();
    console.log('Old Client id: ' + oldClient?.id + ' nickname: ' + oldClient?.nickname);
    if (oldClient) {
      this.loggedInUser = this.storageService.loadClient();
      console.log('Client id: ' + this.loggedInUser?.id + ' nickname: ' + this.loggedInUser?.nickname);
      this.connect(); // MUY IMPORTANTÉ!!
    }
  }


  listenForCommentWelcome(): Observable < WelcomeDto > { // to service?
    console.log('app comp - listenForCommentWelcome called');
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
    // location.reload(); // doesn't work

  }
    /*
    // Can put global error listening here (from comment service)!!
    listenForErrors(): Observable<string> {
      return this.socket
        .fromEvent<string>('error');
   */
  login(): void {
    this.loginRequest = true;
  }

  sendLogin(): void { // should really be in a service but ... you know...
    console.log('sendLogin method');
    if (this.loginFC.value) {
      const dto: loginDto = {nickname: this.loginFC.value};
      console.log(dto.nickname);
      this.socket.emit('login', dto);
      this.loginRequest = false;
    }
  }

  logout(): void {
    console.log('Logout called in App Comp');
    this.loggedInUser = this.storageService.loadClient();
    console.log('logout id :', this.storageService.loadClient()?.id);
    if (this.loggedInUser !== undefined) {
      console.log('logout id is DEFINED as:', this.storageService.loadClient()?.id);
      this.socket.emit('logout', this.loggedInUser.id);
      // this.storageService.deleteClient(this.loggedInUser.id);  // Better, but not working... why??!
      localStorage.clear();  // Brutal, but works for now
      console.log('local storage cleared:', this.storageService.loadClient()?.id);
      location.reload();
    } else {
      console.log('logout id == undefined:', this.storageService.loadClient()?.nickname);
    }
  }


  connect(): void{ // to service?
    this.socket.connect();
  }

  disconnect(): void{ // to service?
    this.socket.disconnect();
  }
}
