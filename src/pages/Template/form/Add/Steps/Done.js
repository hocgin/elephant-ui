import React, { Fragment } from 'react';
import { Button } from 'antd';
import styles from './style.less';
import Result from '@/components/Result';

export default class Step1 extends React.PureComponent {
    render() {
        const actions = (
            <Fragment>
                <Button htmlType="button" type="primary">
                    再转一笔
                </Button>
                <Button htmlType="button">查看账单</Button>
            </Fragment>
        );
        return (
            <Result
                type="success"
                title="操作成功"
                description="操作成功"
                actions={actions}
                className={styles.result}
            />
        );
    }
}
