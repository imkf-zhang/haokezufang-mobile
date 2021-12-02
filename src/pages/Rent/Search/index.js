import React, { Component } from "react";

import { SearchBar } from "antd-mobile";

import { getCity } from "../../../utils/city";
import API from "../../../utils/api";
import styles from "./index.module.css";


export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value;

  state = {
    // 搜索框的值
    searchTxt: "",
    tipsList: [],
  };

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state;

    return tipsList.map((item) => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ));
  };
  handleSearchTxt = async (value) => {
    this.setState({
      searchTxt: value,
    });
    if (!value) {
      return this.setState({
        tipsList: []
      });
    } else {
      const { data: { body} } = await API.get("/area/community",{
        params: {
          name: value,
          id: this.cityId
        },
      });
     this.setState({
       tipsList: body
     })
    }
  };
  render() {
    const { history } = this.props;
    const { searchTxt } = this.state;

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchTxt}
          showCancelButton={true}
          onCancel={() => history.replace("/rent/add")}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    );
  }
}
