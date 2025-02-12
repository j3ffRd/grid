import { Component, OnDestroy, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseWidget, NgCompInputs } from 'gridstack/dist/angular';

@Component({
    selector: 'app-a',
    template: 'Comp A {{text}}',
    standalone: true
})
export class AComponent extends BaseWidget implements OnDestroy {
  @Input() text: string = 'foo'; // test custom input data
  public override serialize(): NgCompInputs | undefined  { return this.text ? {text: this.text} : undefined; }
  constructor() { super(); console.log('Comp A created'); }
  ngOnDestroy() { console.log('Comp A destroyed'); } // test to make sure cleanup happens
}

@Component({
    selector: 'app-b',
    template: 'Comp B',
    standalone: true
})
export class BComponent extends BaseWidget implements OnDestroy {
  constructor() { super(); console.log('Comp B created'); }
  ngOnDestroy() { console.log('Comp B destroyed'); }
}

@Component({
    selector: 'app-c',
    template: 'Comp C',
    standalone: true
})
export class CComponent extends BaseWidget implements OnDestroy {
  ngOnDestroy() { console.log('Comp C destroyed'); }
}
