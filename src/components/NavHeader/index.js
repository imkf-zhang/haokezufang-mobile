import React from "react";
import { withRouter } from "react-router-dom";
import { NavBar } from "antd-mobile";
import PropTypes from "prop-types";
import styles from "./index.module.css";
// import "./index.css";
function NavHeader(props) {
  const defaultHandler = () => { props.history.go(-1)};
  return (
    <NavBar
      mode="light"
      className={styles.navBar}
      icon={<i className="iconfont icon-back" />}
      onLeftClick={ props.onLeftClick || defaultHandler }
    >
      {props.children}
    </NavBar>
  );
}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
  }
// withRouter(NavHeader) 返回值也是一个组件
export default withRouter(NavHeader);
