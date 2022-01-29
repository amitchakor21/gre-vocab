import {Component, OnInit} from '@angular/core';
import {Vocab} from "../api/api-model";
import {VocabStore} from "../store/vocab-store.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})

export class TestComponent implements OnInit {

  constructor(private tempStore: VocabStore) {
  }

  vocabList: Vocab[] = [];

  ngOnInit() {
    this.tempStore.vocabListSubject$
      .subscribe(
        (vocabList: Vocab[]) => {
          this.vocabList = vocabList;
        }
      );
  }

}
