import React from "react";
import { withRouter } from "react-router-dom";
import { Flex} from "antd-mobile";
import PropTypes from "prop-types";
import "./index.css"
function SearchHeader(props) {
    return (
         <Flex className={ ['search-box', props.className || ''].join(" ")}>
         {/* 左侧白色区域 */}
         <Flex className="search">
           {/* 位置 */}
           <div
             className="location"
             onClick={() => props.history.push("/citylist")}
           >
             <span className="name">{props.curCityName}</span>
             <i className="iconfont icon-arrow" />
           </div>

           {/* 搜索表单 */}
           <div
             className="form"
             onClick={() => props.history.push("/search")}
           >
             <i className="iconfont icon-seach" />
             <span className="text">请输入小区或地址</span>
           </div>
         </Flex>
         {/* 右侧地图图标 */}
         <i
           className="iconfont icon-map"
           onClick={() => props.history.push("/map")}
         />
       </Flex>
    )
}
SearchHeader.propTypes = {
    curCityName: PropTypes.string.isRequired,
    className: PropTypes.string
}
export default withRouter(SearchHeader)