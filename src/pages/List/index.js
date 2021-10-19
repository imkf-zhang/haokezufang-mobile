import React from "react";
import { Flex } from "antd-mobile";
import SearchHeader from "../../components/SearchHeader";
import styles from "../List/index.module.css";

const { label } = JSON.parse(localStorage.getItem('hkzf_city'))
class News extends React.Component {
    render() {
        return (
            <Flex className={styles.header}>
                <i className="iconfont" onClick={()=> {this.props.history.go(-1)}}></i>
                <SearchHeader curCityName={label} className={styles.seachHeader} ></SearchHeader>
            </Flex>
        )
    }
  }
  export default  News;