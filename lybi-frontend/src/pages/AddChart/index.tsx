import ReactECharts from 'echarts-for-react';
import {UploadOutlined,} from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload} from 'antd';
import React, {useState} from 'react';
import {genChartByAiUsingPost} from "@/services/lybi/chartController";
import TextArea from "antd/es/input/TextArea";

/**
 *添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option,setOption] = useState<any>();
  const [chart,setChart] = useState<API.BiResponse>();

  /**
   *提交
   * @param values
   */
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting){
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
   //todo 对接后端，上传数据

    const params = {
      ...values,
      file: undefined
    }
    try {

      console.log('请求参数:', params); // 确认chartType是否正确包含在内

      const res =  await genChartByAiUsingPost(params,{},values.file.file.originFileObj)
      if (!res?.data){
        message.error("分析失败");
      }else {
        message.success("分析成功");
        const chartOption = JSON.parse(res.data.genChart ?? ' ');
        if (!chartOption){
          throw new Error("图表代码解析错误")
        }else{
          setChart(res.data);

          setOption(chartOption);
        }
      }
    }catch (e:any){

      message.error("分析失败"+e);
    }
   setSubmitting(false)
  };
// @ts-ignore
  return (
    <div className={"add_chart"}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">

            <Form
              name="addChart"
              labelAlign="left"
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              onFinish={onFinish}
              initialValues={{}}
            >

              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入你的分析需求，比如分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <TextArea placeholder="请输入你的图表名称" />
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"

              >
                <Select options={[
                  { value: 'line', label: '折线图' },
                  { value: 'bar', label: '柱状图' },
                  { value: 'stacked', label: '堆叠图' },
                  { value: 'pie', label: '饼图' },
                  { value: 'radar', label: '雷达图' },
                ]} />
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="fileList" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传csv文件</Button>
                </Upload>
              </Form.Item>


              <Form.Item  wrapperCol={{span: 16, offset: 8}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting}/>
          </Card>
          <Divider type="vertical" />
         <Card title="可视化图表">
           生成图表：
           {
             option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>
           }
           <Spin spinning={submitting}/>
         </Card>
       </Col>
      </Row>



    </div>
  );
};
export default AddChart;
