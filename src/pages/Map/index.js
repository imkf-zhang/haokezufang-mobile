import React from "react";
import axios from "axios";
import NavHeader from "../../components/NavHeader";
import styles from "./index.module.css";

const BMap = window.BMap;
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};
const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
class Map extends React.Component {
  // 容器准备好了再进行初始化地图实例
  componentDidMount() {
    this.initMap();
  }
  initMap = () => {
    // 创建地图实例
    const map = new BMap.Map("container");
    this.map = map;
    // 创建地址解析器实例
    let myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      (point) => {
        if (point) {
          map.centerAndZoom(point, 11);
          map.addControl(new BMap.NavigationControl());
          map.addControl(new BMap.ScaleControl());
        }
      },
      label
    );
    this.renderOverlays(value);
  };
  /**
   * 渲染覆盖物入口
   * @param { String } id
   */
  async renderOverlays(id) {
    const { data: res } = await axios.get("http://localhost:8080/area/map", {
      params: {
        id: id,
      },
    });
    const { type, nextZoom } = this.getTypeAndZoom();
    res.body.forEach((item) => {
      this.createOverlays(item, type, nextZoom);
    });
  }
  /**
   * @param {Object} item
   * @param {String} type
   * @param {Number} nextZoom
   */
  createOverlays(item, type, nextZoom) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = item;
    var areaPoint = new BMap.Point(longitude, latitude);
    if (type === "rect") {
      this.createRect(areaPoint, areaName, count, value, nextZoom);
    } else {
      this.createCircle(areaPoint, areaName, count, value, nextZoom);
    }
  }
  /**
   * @param {Object} areaPoint 坐标
   * @param {String} areaName 区域名字
   * @param {Number} count 数量
   * @param {String} value 区域id
   * @param {Number} nextZoom 缩放级别
   */
  createCircle(areaPoint, areaName, count, value, nextZoom) {
    let opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35), // 设置文本偏移量
    };
    // 创建文本标注对象
    let labeL = new BMap.Label("", opts);
    labeL.setContent(`<div class="${styles.bubble}">
    <p class="${styles.name}">${areaName}</p>
    <p>${count}套</p>
    </div>`);
    labeL.addEventListener("click", () => {
      this.map.centerAndZoom(areaPoint, nextZoom);
      setTimeout(() => {
        this.map.clearOverlays();
        this.renderOverlays(value);
      }, 0);
    });
    labeL.setStyle(labelStyle);
    labeL.id = value;
    this.map.addOverlay(labeL);
  }
  /**
   * @param {Object} areaPoint 坐标
   * @param {String} areaName 区域名字
   * @param {Number} count 数量
   * @param {String} value 区域id
   * @param {Number} nextZoom 缩放级别
   */
   createRect(areaPoint, areaName, count, value, nextZoom) {
    let opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28), // 设置文本偏移量
    };
    // 创建文本标注对象
    let labeL = new BMap.Label("", opts);
    labeL.setContent(`<div class="${styles.bubble}">
      <p class="${styles.name}">${areaName}</p>
      <p>${count}套</p>
      </div>`);
    labeL.addEventListener("click", () => {
      
    });
    labeL.setStyle(labelStyle);
    labeL.id = value;
    this.map.addOverlay(labeL);
  }
  /**
   * 获取地图缩放级别，覆盖物类别
   * @returns {Object} map's zoom and type
   */
  getTypeAndZoom() {
    // 区 => 11   镇 => 13   小区 => 15
    const zoom = this.map.getZoom();
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
      type = "circle";
      nextZoom = 13;
    } else if (zoom >= 12 && zoom < 14) {
      type = "circle";
      nextZoom = 15;
    } else if (zoom >= 14 && zoom < 16) {
      type = "rect";
    }
    return { type, nextZoom };
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
      </div>
    );
  }
}
export default Map;
