import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import { HeartTwoTone } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
export default function Detail(props) {
  const [newsInfo, setnewsInfo] = useState(null);
  useEffect(() => {
    // console.log(props.match.params.id)//获取路径值id
    axios
      .get(`/news/${props.match.params.id}?_expand=category?_expand=role`)
      .then((res) => {
        setnewsInfo({
          ...res.data,
          view: res.data.view + 1,
        });
        //同步后端
        return res.data;
      })
      .then((res) => {
        axios.patch(`/news/${props.match.params.id}`, {
          view: res.view + 1,
        });
      });
  }, [props.match.params.id]);

  const handleStar = () => {
    setnewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1,
    });
    axios.patch(`/news/${props.match.params.id}`, {
      star: newsInfo.star + 1,
    });
  };

  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title} //不加问号会直接报cannot read propperty'title'of null
            //因为newsInfo初始值设置的是 null ,null没有title属性
            //也可以将整段代码用<div></div>包裹起来 newsInfo&&<div></div> 一开始newsInfo为空就不会渲染div后边的内容 直到ajax请求的内容回来才会渲染
            subTitle={
              <div>
                {
                  <HeartTwoTone
                    twoToneColor="#eb2f96"
                    onClick={() => handleStar()}
                  />
                }
              </div>
            } //这里要加问号 因为判断的是newsInfo.category
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>

          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{
              margin: "0 24px",
              border: "1px solid gray",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
