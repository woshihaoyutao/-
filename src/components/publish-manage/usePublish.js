import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios(
      `/news?author=${username}&publishState=${type}&_expand=category`
    ).then((res) =>
      // console.log(res.data)
      setdataSource(res.data)
    );
  }, [username, type]);

  const handlePublish = (id) => {
    // console.log(id)
    setdataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2, //表示已发布
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  const handleSunset = (id) => {
    // console.log(id)
    setdataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3, //表示已发布
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已下线】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  const handleDelete = (id) => {
    // console.log(id)
    setdataSource(dataSource.filter((item) => item.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `通知`,
        description: `您已经删除了已经下线的新闻`,
        placement: "bottomRight",
      });
    });
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}

export default usePublish;
