import React from 'react';
import { connect } from 'dva';
import { Button, Card, Form } from 'antd';
import styles from '../../Access/Role/Index.less';
import * as LangKit from '../../../utils/LangKit';
import StandardTable from '../../../components/StandardTable';

@connect(
    ({ example: { list }, loading }) => ({
        list,
        loading: loading.models.list,
    }),
    dispatch => ({
        $example: () => dispatch({ type: 'example' }),
        $paging: ({}) => dispatch({ type: 'example/$paging' }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        selectedRows: [],
    };

    render() {
        const {
            route: { name },
            loading,
        } = this.props;
        const { selectedRows } = this.state;
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/*搜索层*/}
                        <div className={styles.tableListForm}>{this.renderSearchBar()}</div>
                        {/*工具栏(新建/批量操作)层*/}
                        <div className={styles.tableListOperator}>
                            <Button
                                htmlType="button"
                                icon="plus"
                                onClick={() => this.onShow(Constant.CREATE_MODAL_VISIBLE)}
                                type="primary"
                            >
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Button
                                        htmlType="button"
                                        onClick={() => {
                                            this.$deletes(selectedRows.map(n => n.id));
                                        }}
                                    >
                                        批量删除
                                    </Button>
                                    {/*<Dropdown overlay={menu}>*/}
                                    {/*<Button htmlType="button">*/}
                                    {/*更多操作 <Icon type="down"/>*/}
                                    {/*</Button>*/}
                                    {/*</Dropdown>*/}
                                </span>
                            )}
                        </div>
                        {/*数据表格层*/}
                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={LangKit.toAntProPage(list)}
                            columns={this.columns}
                            onSelectRow={this.onClickSelectRows}
                            onChange={this.onChangeStandardTableCondition}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }

    onClickSearch = () => {
        console.log('搜索');
    };

    SearchBar = ({ onClickSearch }) => {
        return <div onClick={onClickSearch}>SearchBar</div>;
    };
}
