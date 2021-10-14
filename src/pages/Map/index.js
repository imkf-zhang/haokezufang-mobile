import React from "react";
import NavHeader from "../../components/NavHeader";
import "./index.css";
class Map extends React.Component {
  // 容器准备好了再进行初始化地图实例
  componentDidMount() {
      // 创建地图实例
      const map = new window.BMap.Map('container')
      // 设置中心点
      const point = new window.BMap.Point(116.404,39.915)
      // 地图初始化，同时设置地图展示级别
      map.centerAndZoom(point, 15);  
  }
  render() {
    return (
      <div className="map">
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container"></div>
      </div>
    );
  }
}
export default Map;
