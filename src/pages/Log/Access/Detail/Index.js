import React from 'react';
import {connect} from 'dva';
import {Card, Divider} from 'antd';
import * as LangKit from '../../../../utils/LangKit';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const {Description} = DescriptionList;

@connect(
    ({
         accessLog: {detail},
         loading,
         routing: {
             location: {query},
         },
     }) => {
        return {
            data: detail,
            id: query.id,
        };
    },
    dispatch => ({})
)
export default class Index extends React.Component {
    render() {
        const {
            route: {name},
            data,
        } = this.props;
        return (
            data && (
                <PageHeaderWrapper title={name}>
                    <Card bordered={false}>
                        <DescriptionList size="large" title="基础信息" style={{marginBottom: 32}}>
                            <Description term="日志级别">{data.level}</Description>
                            <Description term="日志信息">{data.message}</Description>
                            <Description term="请求方式">{data.method}</Description>
                            <Description term="请求路径">{data.uri}</Description>
                            <Description term="来源">{data.source}</Description>
                            <Description term="来源IP">{data.ip}</Description>
                            <Description term="操作行为">{data.operating}</Description>
                            <Description term="耗时">{data.usageTime} ms</Description>
                            <Description term="访问者账号ID">{data.visitor}</Description>
                            <Description term="创建时间">
                                {LangKit.toUTC(data.createdAt)}
                            </Description>
                            <Description term="更新时间">
                                {LangKit.toUTC(data.updatedAt)}
                            </Description>
                        </DescriptionList>
                        <Divider style={{marginBottom: 32}}/>
                        <DescriptionList size="large" title="Class#Method" style={{marginBottom: 32}}>
                            <Description>
                                {data.mapping}
                            </Description>
                        </DescriptionList>
                        <DescriptionList size="large" title="请求参数" style={{marginBottom: 32}}>
                            <Description>
                                {data.parameters}
                            </Description>
                        </DescriptionList>
                        <DescriptionList size="large" title="响应结果" style={{marginBottom: 32}}>
                            <Description>
                                {data.response}
                            </Description>
                        </DescriptionList>
                    </Card>
                </PageHeaderWrapper>
            )
        );
    }
}
