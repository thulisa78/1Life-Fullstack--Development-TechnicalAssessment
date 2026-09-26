import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Word, WordType } from '../../models/word.model';
import { WordService } from '../../services/word.service';
import { SentenceService } from '../../services/sentence.service';

// A robot did this: main builder screen - pick a word type, pick a word,
// it gets appended to the sentence. Also doubles as the edit screen when
// there's an :id in the route.
@Component({
  selector: 'app-sentence-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentence-builder.component.html',
  styleUrl: './sentence-builder.component.css',
})
export class SentenceBuilderComponent implements OnInit {
  wordTypes: WordType[] = [];
  wordsForSelectedType: Word[] = [];
  selectedTypeId: number | null = null;

  // The words the user has added, in order — this IS the sentence.
  sentenceWords: Word[] = [];
  title = '';

  editingSentenceId: number | null = null;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private wordService: WordService,
    private sentenceService: SentenceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wordService.getWordTypes().subscribe({
      next: (types) => (this.wordTypes = types),
      error: () => (this.errorMessage = 'Could not load word types.'),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadSentenceForEditing(Number(idParam));
    }
  }

  onSelectType(typeId: string): void {
    this.selectedTypeId = typeId ? Number(typeId) : null;
    this.wordsForSelectedType = [];
    if (this.selectedTypeId === null) return;

    this.wordService.getWords(this.selectedTypeId).subscribe({
      next: (words) => (this.wordsForSelectedType = words),
      error: () => (this.errorMessage = 'Could not load words for that type.'),
    });
  }

  addWordToSentence(word: Word): void {
    this.sentenceWords = [...this.sentenceWords, word];
    this.clearMessages();
  }

  removeWordAt(index: number): void {
    this.sentenceWords = this.sentenceWords.filter((_, i) => i !== index);
  }

  moveWord(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.sentenceWords.length) return;
    const words = [...this.sentenceWords];
    [words[index], words[target]] = [words[target], words[index]];
    this.sentenceWords = words;
  }

  clearSentence(): void {
    this.sentenceWords = [];
    this.title = '';
    this.editingSentenceId = null;
    this.clearMessages();
  }

  get sentencePreview(): string {
    return this.sentenceWords.map((w) => w.text).join(' ');
  }

  // Sentences are stored as just an array of word ids, so to edit one we
  // need to pull every word back down and re-map ids -> Word objects in order.
  private loadSentenceForEditing(id: number): void {
    this.sentenceService.getSentence(id).subscribe({
      next: (sentence) => {
        this.editingSentenceId = sentence.id;
        this.title = sentence.title;

        this.wordService.getWords().subscribe({
          next: (allWords) => {
            const byId = new Map(allWords.map((w) => [w.id, w]));
            this.sentenceWords = sentence.word_ids
              .map((wid) => byId.get(wid))
              .filter((w): w is Word => !!w);
          },
        });
      },
      error: () => (this.errorMessage = 'Could not load that sentence.'),
    });
  }

  saveSentence(): void {
    if (this.sentenceWords.length === 0) {
      this.errorMessage = 'Add at least one word before saving.';
      return;
    }

    this.saving = true;
    this.clearMessages();

    const payload = {
      title: this.title?.trim() || 'Untitled sentence',
      content: this.sentencePreview,
      wordIds: this.sentenceWords.map((w) => w.id),
    };

    const request$ = this.editingSentenceId
      ? this.sentenceService.updateSentence(this.editingSentenceId, payload)
      : this.sentenceService.createSentence(payload);

    request$.subscribe({
      next: (saved) => {
        this.saving = false;
        this.successMessage = this.editingSentenceId
          ? 'Sentence updated.'
          : 'Sentence saved.';
        this.editingSentenceId = saved.id;
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Could not save that sentence. Please try again.';
      },
    });
  }

  viewSaved(): void {
    this.router.navigate(['/saved']);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
