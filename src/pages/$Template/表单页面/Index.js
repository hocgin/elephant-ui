import React from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import styles from '../../Access/Role/Index.less';
import * as LangKit from '../../../utils/LangKit';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import moment from 'moment';

@connect(
    ({ example: { page }, loading }) => ({
        data: LangKit.toAntProPage(page),
        loading: loading.models.list,
    }),
    dispatch => ({
        $paging: body => dispatch({ type: 'example/$paging', ...body }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        selectedRows: [],
    };

    columns = [
        {
            title: '编号',
            dataIndex: 'id',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
    ];

    componentDidMount() {
        const { $paging } = this.props;
        $paging();
    }

    render() {
        const {
            route: { name },
            data,
            loading,
        } = this.props;
        const { selectedRows } = this.state;
        console.log('data', data);
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/*数据表格层*/}
                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            // onSelectRow={this.onClickSelectRows}
                            // onChange={this.onChangeStandardTableCondition}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
