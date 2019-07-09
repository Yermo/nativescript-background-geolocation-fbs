import { 
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import { RouterExtensions } from "nativescript-angular/router";

import { setTimeout } from "tns-core-modules/timer";

import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { ListViewLinearLayout, RadListView, LoadOnDemandListViewEventData, ListViewScrollDirection } from "nativescript-ui-listview";

import { ObservableArray } from "tns-core-modules/data/observable-array"; 

import { LocationsService } from "../../services/locations.service";
import { LogEntry } from "nativescript-background-geolocation-fbs";

enum SortingOrder {
    NSOrderedAscending = -1,
    NSOrderedSame = 0,
    NSOrderedDescending = 1
}

// ----------------------------------------------------------------

/**
* DebugLog page.
*
* This page enables the user to scroll through the debug log generated
* by the background geolocation plugin.
*
* @link https://github.com/NativeScript/nativescript-ui-samples-angular/tree/master/listview/src/app/examples/getting-started
*/

@Component({
  selector: 'debug-log-page',
  templateUrl: 'debug-log-page.component.html',
  styleUrls: ["./debug-log-page.component.css"],
})
export class DebugLogPageComponent implements OnInit {

  private _messagesObservable: ObservableArray<LogEntry>;
  private idSortOrder: string;
  private levelSortOrder: string;

  private _sortById: (item: any, otherItem: any) => number;
  private _sortByLevel: (item: any, otherItem: any) => number;
  private layout: ListViewLinearLayout;

  @ViewChild("listView") listViewComponent: RadListViewComponent;

  constructor(
    private routerExtensions: RouterExtensions,
    private locationsService: LocationsService,
    private _changeDetectionRef: ChangeDetectorRef
  ) {

    this._sortById = ( entry: LogEntry, otherEntry: LogEntry) => {
      let res = entry.id < otherEntry.id ? SortingOrder.NSOrderedDescending : entry.id > otherEntry.id ? SortingOrder.NSOrderedAscending : SortingOrder.NSOrderedSame;

      if ( this.idSortOrder == 'desc' ) {
        res = -res;
      }
    
      return res;
    };

    this._sortByLevel = ( entry: LogEntry, otherEntry: LogEntry) => {
      let res = entry.level < otherEntry.level ? SortingOrder.NSOrderedDescending : entry.level > otherEntry.level ? SortingOrder.NSOrderedAscending : SortingOrder.NSOrderedSame;

      if ( this.levelSortOrder == 'desc' ) {
        res = -res;
      }

      return res;
    };

    this.idSortOrder = 'none';
    this.levelSortOrder = 'none';

  }

  // ------------------------------------------------------------

  async ngOnInit() {

    let messages = await this.locationsService.getLogEntries( 25, 0, 'DEBUG' );

    this._messagesObservable = new ObservableArray( messages );

  }

  // -----------------------------------------------------

  get messages(): ObservableArray<LogEntry> {
    return this._messagesObservable;
  }

  // --------------------------------------------------------------------

  /**
  * Gets another 25 rows of log entries
  *
  * The background-geolocation-android API is a bit whacked in that the offset is actually 
  * the id of the oldest message instead of being an offset into the table. I'm guessing it
  * was designed this way because debug messages are constantly coming in. 
  */

  async getMoreMessages() {

    // get the id of the oldest message

    let entry = this._messagesObservable.getItem( this._messagesObservable.length - 1 );

    console.log( "DebugLogPageComponent::getMoreMessages(): offset '" + this._messagesObservable.length + "' entry is:", entry );

    let messages = await this.locationsService.getLogEntries( 25, entry.id, 'DEBUG' );

    // console.log( "DebugLogPageComponent::getMoreMessages(): get messages:", messages );

    this._messagesObservable.push( messages );

  }
  
  // --------------------------------------------------------------------

  /**
  *
  * @link https://github.com/NativeScript/nativescript-ui-samples-angular/blob/master/listview/src/app/examples/load-on-demand/dynamic-size-auto/listview-dynamic-size-auto.component.ts
  */ 

  public onLoadMoreItemsRequested( args: LoadOnDemandListViewEventData ) {

    const that = new WeakRef(this);
    const listView: RadListView = args.object;

    console.log( "DebugLogPageComponent::onLoadMoreItemsRequested()" );

    if ( this._messagesObservable.length > 0 ) {

      setTimeout( function () {
        that.get().getMoreMessages();
        listView.notifyLoadOnDemandFinished();
      }, 1500);

    } else {

      args.returnValue = false;
      listView.notifyLoadOnDemandFinished(true);

    }
  }

  // -----------------------------------------------------

  public toggleSortById() {

    this.levelSortOrder = 'none';

    let listView = this.listViewComponent.listView;

    listView.sortingFunction = this._sortById;

    if ( this.idSortOrder == 'asc' ) {
      this.idSortOrder = 'desc';
    } else {
      this.idSortOrder = 'asc';
    }

    listView.refresh();

  }

  // -----------------------------------------------------

  public toggleSortByLevel() {

    // for the moment we only support sorting by one column at a time.

    this.idSortOrder = 'none';

    let listView = this.listViewComponent.listView;

    listView.sortingFunction = this._sortByLevel;

    if ( this.levelSortOrder == 'asc' ) {
      this.levelSortOrder = 'desc';
    } else {
      this.levelSortOrder = 'asc';
    }

    listView.refresh();

  }

  // -----------------------------------------------------

  public goBack() {
    this.routerExtensions.backToPreviousPage();
  }

}

// END
