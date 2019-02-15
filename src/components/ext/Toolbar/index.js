import React from 'react';
import { Button, Dropdown, Icon } from 'antd';
import styles from './index.less';

export default class Toolbar extends React.PureComponent {
    render() {
        const { children, menu, selectedRows } = this.props;
        return (
            <div className={styles.tableListOperator}>
                {children}
                {selectedRows.length > 0 &&
                    menu && (
                        <span>
                            <Dropdown overlay={menu}>
                                <Button htmlType="button">
                                    批量操作 <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </span>
                    )}
            </div>
        );
    }
}
