import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB } from 'gridstack/dist/angular';
import { AComponent, BComponent, CComponent } from './dummy.component';

// unique ids sets for each item for correct ngFor updating
let ids = 1;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [GridstackComponent]
})
export class AppComponent implements OnInit {

  @ViewChild(GridstackComponent) gridComp?: GridstackComponent;
  @ViewChild('origTextArea', {static: true}) origTextEl?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('textArea', {static: true}) textEl?: ElementRef<HTMLTextAreaElement>;

  // which sample to show
  public show = 5;

  /** sample grid options and items to load... */
  public items: GridStackWidget[] = [
    {x: 0, y: 0, minW: 2},
    {x: 1, y: 1},
    {x: 2, y: 2},
  ];

  public gridOptions: GridStackOptions = {
    margin: 5,
    float: true,
    minRow: 1,
    cellHeight: 70,
    columnOpts: { breakpoints: [{w:768, c:1}] },
  }

  public sub0: NgGridStackWidget[] = [{x:0, y:0, selector:'app-a'}, {x:1, y:0, selector:'app-a', input: {text: 'bar'}}, {x:1, y:1, content:'plain html'}, {x:0, y:1, selector:'app-b'} ];
  public gridOptionsFull: NgGridStackOptions = {
    ...this.gridOptions,
    children: this.sub0,
  }

  public sub1: NgGridStackWidget[] = [ {x:0, y:0, selector:'app-a'}, {x:1, y:0, selector:'app-b'}, {x:2, y:0, selector:'app-c'}, {x:3, y:0}, {x:0, y:1}, {x:1, y:1}];
  public sub2: NgGridStackWidget[] = [ {x:0, y:0}, {x:0, y:1, w:2}];
  public sub3: NgGridStackWidget = { selector: 'app-n', w:2, h:2, subGridOpts: { children: [{selector: 'app-a'}, {selector: 'app-b', y:0, x:1}]}};
  
  private subChildren: NgGridStackWidget[] = [
    {x:0, y:0, content: 'regular item'},
    {x:1, y:0, w:4, h:4, subGridOpts: {children: this.sub1}},
    this.sub3,
  ]

  private serializedData?: NgGridStackOptions;

  constructor() {
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent]);
    // give them content and unique id to make sure we track them during changes below...
    [...this.items, ...this.subChildren, ...this.sub1, ...this.sub2, ...this.sub0].forEach((w: NgGridStackWidget) => {
      if (!w.selector && !w.content && !w.subGridOpts) w.content = `item ${ids++}`;
    });
  }

  ngOnInit(): void {
    this.onShow(this.show);
  }

  public onShow(val: number) {
    this.show = val;
    GridStack.addRemoveCB = gsCreateNgComponents;
  }

  /** called whenever items change size/position/etc.. */
  public onChange(data: nodesCB) {
    // TODO: update our TEMPLATE list to match ?
    // NOTE: no need for dynamic as we can always use grid.save() to get latest layout, or grid.engine.nodes
    console.log('change ', data.nodes.length > 1 ? data.nodes : data.nodes[0]);
  }

  public onResizeStop(data: elementCB) {
    console.log('resizestop ', data.el.gridstackNode);
  }

  /**
   * TEST dynamic grid operations - uses grid API directly (since we don't track structure that gets out of sync)
   */
  public add() {
    // TODO: BUG the content doesn't appear until widget is moved around (or another created). Need to force
    // angular detection changes...
    this.gridComp?.grid?.addWidget({x:3, y:0, w:2, content:`item ${ids}`, id:String(ids++)});
  }

  public delete() {
    let grid = this.gridComp?.grid;
    if (!grid) return;
    let node = grid.engine.nodes[0];
    // delete any children first before subGrid itself...
    if (node?.subGrid && node.subGrid.engine.nodes.length) {
      grid = node.subGrid;
      node = grid.engine.nodes[0];
    }
    if (node) grid.removeWidget(node.el!);
  }

  public modify() {
    this.gridComp?.grid?.update(this.gridComp?.grid.engine.nodes[0]?.el!, {w:3})
  }

  public newLayout() {
    this.gridComp?.grid?.load([
      {x:0, y:1, id:'1', minW:1, w:1}, // new size/constrain
      {x:1, y:1, id:'2'},
      // {x:2, y:1, id:'3'}, // delete item
      {x:3, y:0, w:2, content:'new item'}, // new item
    ]);
  }

  public load(layout: GridStackWidget[]) {
    this.gridComp?.grid?.load(layout);
  }

  public clearGrid() {
    if (!this.gridComp) return;
    this.gridComp.grid?.removeAll();
  }

  public saveGrid() {
    this.serializedData = this.gridComp?.grid?.save(false, true) as GridStackOptions || ''; // no content, full options
    if (this.textEl) this.textEl.nativeElement.value = JSON.stringify(this.serializedData, null, '  ');
  }

  public loadGrid() {
    if (!this.gridComp) return;
    GridStack.addGrid(this.gridComp.el, this.serializedData);
  }
}
