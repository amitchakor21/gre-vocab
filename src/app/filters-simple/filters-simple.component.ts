import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../api/config.service";
import {Vocab} from "../api/api-model";

@Component({
  selector: 'app-filters-simple',
  templateUrl: './filters-simple.component.html',
  styleUrls: ['./filters-simple.component.scss']
})
export class FiltersSimpleComponent implements OnInit {

  vocabList: Vocab[] = []
  pageNumber = 0

  constructor(private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.configService.getVocabByRequest({page: 0, size: 40}).subscribe(response => {
      this.vocabList = response;
    });
  }

  patchSimple(vocab: Vocab) {
    vocab.simple = !vocab.simple;
    vocab.known = !vocab.known;
    this.configService.patchVocab(vocab).subscribe();
  }

  patchKnown(vocab: Vocab) {
    vocab.known = !vocab.known
    this.configService.patchVocab(vocab).subscribe();
  }

  updateVocabList() {
    this.configService.getVocabByRequest({page: this.pageNumber, size: 40}).subscribe(response => {
      this.vocabList = response;
    });
  }
}
