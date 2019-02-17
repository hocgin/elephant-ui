import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Index.less';

const { Step } = Steps;
@connect(args => {
    console.log(args);
    return {};
})
export default class Index extends PureComponent {
    getCurrentStep() {
        const { location } = this.props;
        const { pathname } = location;
        const pathList = pathname.split('/');
        switch (pathList[pathList.length - 1]) {
            case 'basic':
                return 0;
            case 'other':
                return 1;
            case 'done':
                return 2;
            default:
                return 0;
        }
    }

    render() {
        const {
            route: { name },
            location: { pathname },
            children,
        } = this.props;
        return (
            <PageHeaderWrapper
                title={name}
                tabActiveKey={pathname}
                content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。"
            >
                <Card bordered={false}>
                    <Fragment>
                        <Steps current={this.getCurrentStep()} className={styles.steps}>
                            <Step title="基础信息" />
                            <Step title="其他信息" />
                            <Step title="完成" />
                        </Steps>
                        {children}
                    </Fragment>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
