import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Tree } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import * as LangKit from '../../../utils/LangKit';
import * as RenderKit from '../../../utils/RenderKit';

const { Description } = DescriptionList;

@connect(({ role, loading }) => ({
    detail: role.detail,
    loading: loading.effects['role/detail'],
}))
export default class Detail extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {
            dispatch,
            location: { query },
        } = this.props;
        const id = query.id;
        dispatch({
            type: 'role/detail',
            payload: {
                id,
            },
        });
    }

    render() {
        const {
            route: { name },
            detail,
        } = this.props;
        return (
            detail && (
                <PageHeaderWrapper title={name}>
                    <Card bordered={false}>
                        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
                            <Description term="角色名称">{detail.name}</Description>
                            <Description term="角色标识">{detail.mark}</Description>
                            <Description term="状态">
                                {RenderKit.renderSwitch(detail.enabled)}
                            </Description>
                            <Description term="创建时间">
                                {LangKit.toUTC(detail.createdAt)}
                            </Description>
                            <Description term="更新时间">
                                {LangKit.toUTC(detail.updatedAt)}
                            </Description>
                            <Description term="描述">{detail.description}</Description>
                        </DescriptionList>
                        <Divider style={{ marginBottom: 32 }} />
                        <DescriptionList size="large" title="资源信息" style={{ marginBottom: 32 }}>
                            <Description>{this.renderTree()}</Description>
                        </DescriptionList>
                    </Card>
                </PageHeaderWrapper>
            )
        );
    }

    /**
     * 渲染树
     */
    renderTree = () => {
        const {
            detail: { resources },
        } = this.props;
        console.log('resources', resources);
        if (LangKit.isEmpty(resources)) {
            return '暂无';
        }
        const tree = LangKit.buildTree3(resources);
        console.log(tree);
        return (
            <Tree defaultExpandAll={true} showLine>
                {RenderKit.renderResourceTreeNode(null, [tree])}
            </Tree>
        );
    };
}
