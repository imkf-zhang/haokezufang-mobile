import React from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import NavHeader from "../../components/NavHeader";
import HouseItem from "../../components/HouseItem";
import styles from "./index.module.css";
import { Toast } from "antd-mobile";
import { BASE_URL } from "../../utils/url"
import API from "../../utils/api";
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
  state = {
    // 小区下的房源列表
    housesList: [],
    // 表示是否展示房源列表
    isShowList: false,
  };
  // 容器准备好了再进行初始化地图实例
  componentDidMount() {
    this.initMap();
  }
  /**
   * 初始化地图
   */
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
    map.addEventListener("movestart", () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false,
        });
      }
    });
    this.renderOverlays(value);
  };
  /**
   * 渲染覆盖物入口
   * @param { String } id
   */
  async renderOverlays(id) {
    Toast.loading("Loading...", 0, null, false);
    const { data: res } = await API.get("/area/map", {
      params: {
        id: id,
      },
    });
    Toast.hide();
    const { type, nextZoom } = this.getTypeAndZoom();
    res.body.forEach((item) => {
      this.createOverlays(item, type, nextZoom);
    });
  }
  /**
   * 渲染覆盖物
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
      this.createRect(areaPoint, areaName, count, value);
    } else {
      this.createCircle(areaPoint, areaName, count, value, nextZoom);
    }
  }
  /**
   * 渲染圆形覆盖物
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
   * 渲染矩形覆盖物
   * @param {Object} areaPoint 坐标
   * @param {String} areaName 区域名字
   * @param {Number} count 数量
   * @param {String} value 区域id
   * @param {Number} nextZoom 缩放级别
   */
  createRect(areaPoint, areaName, count, value) {
    let opts = {
      position: areaPoint, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28), // 设置文本偏移量
    };
    // 创建文本标注对象
    let labeL = new BMap.Label("", opts);
    labeL.setContent(`<div class="${styles.recT}">
    <span class="${styles.housename}">${areaName}</span>
      <span class="${styles.housenum}">${count}套</span>
      <i class="${styles.arrow}"></i>
    </div>`);
    labeL.addEventListener("click", (e) => {
      console.log("小区被点击了");
      this.getHousesList(value);
      const target = e.changedTouches[0];
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      );
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
  /**
   * 获取小区房源数据
   * @param {String} 区域id
   * @returns
   */
  async getHousesList(id) {
    try {
      Toast.loading("Loading...", 0, null, false);
      const { data: res } = await API.get("/houses", {
        params: {
          cityId: id,
        },
      });
      Toast.hide();
      this.setState(() => {
        return {
          housesList: res.body.list,
          isShowList: true,
        };
      });
    } catch (e) {
      Toast.hide();
    }
  }
  /**
   * 渲染小区房屋列表
   */
  renderHouseList = () => {
    return this.state.housesList.map((item) => (
      <HouseItem
      key={ item.houseCode }
      src={ BASE_URL + item.houseImg }
      title={ item.title }
      desc={item.desc}
      tags={item.tags}
      price={item.price}
       />
    ))
    // return this.state.housesList.map((item) => (
    //   <div className={styles.house} key={item.houseCode}>
    //     <div className={styles.imgWrap}>
    //       <img
    //         className={styles.img}
    //         src={`${BASE_URL}${item.houseImg}`}
    //         alt=""
    //       />
    //     </div>
    //     <div className={styles.content}>
    //       <h3 className={styles.title}>{item.title}</h3>
    //       <div className={styles.desc}>{item.desc}</div>
    //       <div>
    //         {item.tags.map((tag, index) => {
    //           let tagClass = `tag${index + 1}`;
    //           return (
    //             <span
    //               className={[styles.tag, styles[tagClass]].join(" ")}
    //               key={tag}
    //             >
    //               {tag}
    //             </span>
    //           );
    //         })}
    //       </div>
    //       <div className={styles.price}>
    //         <span className={styles.priceNum}>{item.price}</span> 元/月
    //       </div>
    //     </div>
    //   </div>
    // ));
  };
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHouseList()}
          </div>
        </div>
      </div>
    );
  }
}
export default Map;
