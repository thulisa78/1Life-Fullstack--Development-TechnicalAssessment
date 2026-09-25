import { Routes } from '@angular/router';
import { SentenceBuilderComponent } from './components/sentence-builder/sentence-builder.component';
import { SavedSentencesComponent } from './components/saved-sentences/saved-sentences.component';

export const routes: Routes = [
  { path: '', redirectTo: 'build', pathMatch: 'full' },
  { path: 'build', component: SentenceBuilderComponent },
  { path: 'build/:id', component: SentenceBuilderComponent },
  { path: 'saved', component: SavedSentencesComponent },
  { path: '**', redirectTo: 'build' },
];
