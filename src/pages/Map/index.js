import React from "react";
import axios from "axios"
import NavHeader from "../../components/NavHeader";
import styles from "./index.module.css"

const BMap = window.BMap;
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}
const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
class Map extends React.Component {
  // 容器准备好了再进行初始化地图实例
  componentDidMount() {
    this.initMap();
    
  }
  initMap = () => {
    // 创建地图实例
    const map = new BMap.Map("container");
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
    this.getRange(map);
  };
  /**
   * 绘制文本标注
   * @param {Object} map 
   * @param {Object} item 
   */
  textAnnotation = (map,item) => {
    var point = new BMap.Point(Number(item.coord.longitude), Number(item.coord.latitude));
    let opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35), // 设置文本偏移量
    };
    // 创建文本标注对象
    let labeL = new BMap.Label("", opts);
    labeL.setContent(`<div class="${styles.bubble}">
    <p class="${styles.name}">${item.label}</p>
    <p>${item.count}套</p>
    </div>`);
    labeL.addEventListener('click',()=> {
      console.log(item.value);
      map.centerAndZoom(point, 16);
      setTimeout(()=> {
        map.clearOverlays()
      },0);
    })
    labeL.setStyle(labelStyle);
    labeL.id = item.value
    map.addOverlay(labeL);
   }
  /** 
   * 获取区的数据
   * @param { Object } map
   * @returns 
   */
  async getRange(map) {
    const { data: res } = await axios.get("http://localhost:8080/area/map", {
      params: {
        id: value,
      },
    });
    res.body.forEach(item => {
         this.textAnnotation(map,item)
    })
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
