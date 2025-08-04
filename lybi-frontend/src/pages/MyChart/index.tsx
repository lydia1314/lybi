import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';
import {
  listMyChartByPageUsingPost,
} from "@/services/lybi/chartController";
import {Avatar, Card, Divider, List, message} from "antd";
import {useModel} from "@umijs/max";
import Search from "antd/es/input/Search";

/**
 *我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {

  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const {initialState} = useModel('@@initialState')
  const {currentUser} = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setTotal(res.data.total ?? 0);
        setChartList(res.data.records ?? []);
      } else {
        message.error("获取图表失败");
      }
    } catch (e: any) {
      message.error("获取我的数据失败：" + e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className={"my-chart-page"}>
      <div>
        <Search placeholder="请输入图表名称"  enterButton onSearch={(value)=>{
         //设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name:value,
          })

        }} />
        <div style={{marginBottom: 16}}/>
      </div>
      <div className={"margin-16"}/>
      <List
      itemLayout="horizontal"
      grid={{gutter:16 ,
        sm:1,
        xs:1,
        md:1,
        lg:2,
        xl:2,
        xxl:2}}
      pagination={{
        onChange: (page,pageSize) => {
          setSearchParams({
            ...initSearchParams,
            current:page,
            pageSize:pageSize,
          })
        },
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total:total,
      }}
      loading={loading}
      dataSource={chartList}
      footer={
        <div>
          <b>ant design</b> footer part
        </div>
      }
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card>
          <List.Item.Meta
            avatar={<Avatar src={currentUser?.userAvatar}/>}
            title={item.name}
            description={item.chartType ? ('图表类型：' + item.chartType) : undefined}
          />
          {'分析目标：' + item.goal}
          <div style={{marginBottom: 16}} />

              <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>

            </Card>
        </List.Item>
      )}
    />
      总数：{total}
    </div>
  );
};
export default MyChartPage;
