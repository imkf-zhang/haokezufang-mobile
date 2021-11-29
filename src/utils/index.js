import API from "./api";
/**
 * 获取当前所在城市名称
 * @returns {string} 当前所在城市
 */
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.LocalCity();
      myCity.get(async (res) => {
        try {
          const { data: reslust } = await API.get(
            "/area/info",
            {
              params: {
                name: res.name,
              },
            }
          );
          // console.log(reslust)
          localStorage.setItem("hkzf_city", JSON.stringify(reslust.body));
          resolve(reslust.body);
        } catch (e) {
          reject(e);
        }
      });
    });
  } else {
    // 没有的时候返回的是一个promise，为了保持统一，
    //没有值的时候也要返回一个promise对象
    // 此处promise不会失败，所以，此处只要返回一个成功的promise即可
    return Promise.resolve(localCity)
  }
};
