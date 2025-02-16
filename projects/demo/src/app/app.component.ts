import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, QueryList,  } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB, GridstackItemComponent } from 'gridstack/dist/angular';
import { AComponent, BComponent, CComponent } from './dummy.component';
import { CommonModule } from '@angular/common';

// unique ids sets for each item for correct ngFor updating
let ids = 1;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [GridstackComponent, GridstackItemComponent,BComponent, CommonModule]
})
export class AppComponent implements AfterViewInit  {

  @ViewChild(GridstackComponent) gridComp?: GridstackComponent;

  ngAfterViewInit() {
    const items2 = this.gridComp?.gridstackItems ?? new QueryList();

    items2.forEach(x => {
      console.log(x);
      const it = this.items.find(y => y.id == x.el.id)!;
      this.gridComp?.grid?.update(x.el, {h: it.h, w: it.w} );
  })
  }

  public items: GridStackWidget[] = [
    {x: 0, y: 0, w: 1, id: '11', h: 1 },
    {x: 1, y: 1, w: 3, id: '22', h: 3},
    {x: 2, y: 2, w: 2, id: '33', h: 2},
  ];

  public gridOptions: GridStackOptions = {
    margin: 5,
    float: true,
    minRow: 2,
    cellHeight: 'auto',
    columnOpts: { breakpoints: [{w:768, c:1}] },
  }

  private serializedData?: NgGridStackOptions;

  constructor() {
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent]);
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

  public deleteW(id: string |undefined) {
    this.gridComp?.grid?.removeWidget(id!);
  }

  public modify() {
    this.gridComp?.grid?.update(this.gridComp?.grid.engine.nodes[0]?.el!, {w:3})
  }

  public clearGrid() {
    if (!this.gridComp) return;
    this.gridComp.grid?.removeAll();
  }

  public saveGrid() {
    this.serializedData = this.gridComp?.grid?.save(false, true) as GridStackOptions || ''; // no content, full options
    
  }

  public loadGrid() {
    if (!this.gridComp) return;
    //GridStack.addGrid(this.gridComp.el, this.serializedData);
  }

  identify(index: number, w: GridStackWidget) {
    return w.id;
  }
}
