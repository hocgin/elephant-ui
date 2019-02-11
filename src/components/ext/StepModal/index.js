import React, {PureComponent} from "react";
import {Button, Modal, Steps} from "antd";

/**
 *
 */
export default class StepModal extends PureComponent {

    render() {
        const {onCancel, visible, titles, children, step} = this.props;

        // ============
        const previousBtn = (<Button
                key="previous"
                htmlType="button"
                style={{float: 'left'}}
                onClick={this.onPrevious}>
                上一步
            </Button>),
            nextBtn = (<Button key="next" type="primary" htmlType="button" onClick={this.onNextAndDone}>
                下一步
            </Button>),
            cancelBtn = (<Button key="cancel" htmlType="button" onClick={this.onCancel}>
                取消
            </Button>),
            doneBtn = (<Button key="submit" htmlType="button" type="primary" onClick={this.onNextAndDone}>
                完成
            </Button>);
        let footer = [];
        // 第一个, [取消, 下一步]
        if (step === 0) {
            footer = [cancelBtn, nextBtn];
        }
        // 中间, [上一步, 取消, 下一步]
        else if (step > 0 && (step + 1) < titles.length) {
            footer = [previousBtn, cancelBtn, nextBtn];
        }
        // 最后一个, [上一步, 取消, 完成]
        else {
            footer = [previousBtn, cancelBtn, doneBtn];
        }


        const content = children[step];
        return (<Modal width={640}
                       bodyStyle={{padding: '32px 40px 48px'}}
                       title="创建角色"
                       visible={visible}
                       onCancel={onCancel}
                       footer={footer}>
            <Steps size="small" current={step} style={{marginBottom: 28}}>
                {titles.map((title) => (<Steps.Step {title}/>))}
            </Steps>
            {content}
        </Modal>);
    }


    onNextAndDone() {

    }

    onPrevious() {

    }
}