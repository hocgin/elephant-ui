import React from 'react';
import {connect} from 'dva';
import {Card, Form} from 'antd';
import styles from '../../Access/Role/Index.less';
import * as LangKit from '../../../utils/LangKit';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import moment from 'moment';
import * as DateFormatter from "../../../utils/formatter/DateFormatter";
import SearchBar from "../../../components/ext/SearchBar";

@connect(
    ({example: {page}, loading}) => ({
        data: LangKit.toAntProPage(page),
        loading: loading.models.list,
    }),
    dispatch => ({
        $paging: body => dispatch({type: 'example/$paging', ...body}),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        selectedRows: [],
        searchValues: null,
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
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
    ];

    componentDidMount() {
        const {$paging} = this.props;
        $paging();
    }

    render() {
        const {
            route: {name},
            data,
            loading,
        } = this.props;
        const {selectedRows} = this.state;
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <SearchBar onSubmit={(...args)=>{
                        console.log('Search', args);
                    }}/>
                    <div className={styles.tableList}>
                        {/*数据表格层*/}
                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            onSelectRow={this.onSelectRows}
                            onChange={this.onChangeStandardTableCondition}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }

    onSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    };

    onChangeStandardTableCondition = (pagination, filtersArg, sorter) => {
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = {...obj};
            newObj[key] = toString(filtersArg[key]);
            return newObj;
        }, {});
        const {searchValues} = this.state;
        const {$paging} = this.props;

        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            ...searchValues,
            ...filters,
        };
        if (sorter.field) {
            params.sort = {
                [sorter.field]: sorter.order === 'descend' ? 'DESC' : 'ASC',
            };
        }
        $paging({payload: params});
    };
}
