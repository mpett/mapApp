import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";

import * as geolocation from "nativescript-geolocation";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;

    currentLat: number;
    currentLng: number;

    onMapReady(args: any) {
        args.map.setCenter(
            {
                lat: this.currentLat,
                lng: this.currentLng,
                animated: true,
                zoomLevel: 14
            }
        )
    }

    // This pattern makes use of Angular’s dependency injection implementation to
    // inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule,
    // defined in app.module.ts.
    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.items = this.itemService.getItems();

        console.log('Checking if geolocation is enabled.');
        geolocation.isEnabled().then(enabled => {
            console.log('isEnabled = ', enabled);
            if (enabled) {
                this.watch();
            } else {
                this.request();
            }
        }, e => {
            console.log('isEnabled error', e);
            this.request();
        });
    }

    request() {
        console.log("enableLocationRequest()");
        geolocation.enableLocationRequest().then(() => {
            console.log("location enabled!");
            this.watch();
        }, e => {
            console.log('Failed to enable', e);
        });
    }

    watch() {
        console.log('watchlocation()');
        geolocation.watchLocation(position => {
            this.currentLat = position.latitude;
            this.currentLng = position.longitude;
        }, e => {
            console.log('failed to get location');
        }, {
            desiredAccuracy: 3,
            minimumUpdateTime: 500
        });
    }
}
