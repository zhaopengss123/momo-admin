import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';

declare const BMap: any;

@Component({
  selector: 'app-bmap',
  templateUrl: './bmap.component.html',
  styleUrls: ['./bmap.component.less']
})
export class BmapComponent implements OnInit {

  @Input() lng: number;
  @Input() lat: number;

  constructor(
    private message: NzMessageService,
    private drawerRef: NzDrawerRef
  ) { }

  map: any;
  myGeo: any;

  ngOnInit() {
    this.map = new BMap.Map('allmap');
    var point = new BMap.Point(this.lng || 116.404, this.lat || 39.915);
    this.map.centerAndZoom(point, 15);
    this.map.enableScrollWheelZoom(true);

    this.myGeo = new BMap.Geocoder();


    this.map.addEventListener('click', this.getPoint);
    this.lng && this.getPoint({ point: { lng: this.lng, lat: this.lat } });

    
  }

  getPoint = (e) => {
    this.map.clearOverlays();
    var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
    this.lng = e.point.lng;
    this.lat = e.point.lat;
    this.map.addOverlay(marker);
  }

  search(address: string) {
    this.myGeo.getPoint(address, (point) => {
      if (point) {
        this.getPoint({ point });
        this.map.centerAndZoom(point, 16);
      } else {
        this.message.warning("您选择地址没有解析到结果!");
      }
    });
  }

  save() {
    this.drawerRef.close(this.lng ? { lng: this.lng, lat: this.lat } : null);
  }

}
