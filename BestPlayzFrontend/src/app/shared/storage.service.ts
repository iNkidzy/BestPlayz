import { Injectable } from '@angular/core';
import {ClientModel} from '../comment/shared/client.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
    saveClient(commentClient: ClientModel): void {
      localStorage.setItem('client', JSON.stringify(commentClient));
  }

  loadClient(): ClientModel | undefined {
    const commentClientString = localStorage.getItem('client');
    if (commentClientString) {
      const commentClient: ClientModel = JSON.parse(commentClientString);
      return commentClient;
    }
    return undefined;
  }

  deleteClient(id: string): void {
  }

}
