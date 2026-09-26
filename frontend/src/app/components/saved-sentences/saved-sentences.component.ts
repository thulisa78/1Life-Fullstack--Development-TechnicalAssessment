import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Sentence } from '../../models/sentence.model';
import { SentenceService } from '../../services/sentence.service';

@Component({
  selector: 'app-saved-sentences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-sentences.component.html',
  styleUrl: './saved-sentences.component.css',
})
export class SavedSentencesComponent implements OnInit {
  sentences: Sentence[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private sentenceService: SentenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sentenceService.getSentences().subscribe({
      next: (sentences) => {
        this.sentences = sentences;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load saved sentences.';
        this.loading = false;
      },
    });
  }

  edit(sentence: Sentence): void {
    this.router.navigate(['/build', sentence.id]);
  }
}
