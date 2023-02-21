import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import axios from "axios";
import moment from "moment";
export default function NewsPreview(props) {
  const [newsInfo, setnewsInfo] = useState(null);
  useEffect(() => {
    // console.log(props.match.params.id)//获取路径值id
    axios
      .get(`/news/${props.match.params.id}?_expand=category?_expand=role`)
      .then((res) => setnewsInfo(res.data));
  }, [props.match.params.id]);

  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"]; //以数组的形式 将回来的0.1.2.3以colorList[0/1/2/3]形式显示
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
            subTitle={newsInfo.category?.title} //这里要加问号 因为判断的是newsInfo.category
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[newsInfo.auditState] }}>
                  {/* 这里回来的0/1是没办法显示成已审核未审核字段 需要写一个数组 根据数组索引值匹配 */}
                  {auditList[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[newsInfo.publishState] }}>
                  {publishList[newsInfo.publishState]}
                </span>
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
