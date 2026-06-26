import React, { useEffect, useState } from 'react';
import { Modal, Space, Form, Input, Radio, Checkbox, message } from 'antd';
// import './MyStatisticModal.scss';
import {editQuestionnaireAnswer} from '@/services/statistics/statistics'
import type {EditQuestionnaireData, Answer as EditAnswer} from '@/services/statistics/type';
import type { Question, Option, SubTitle } from '@/services/statistics/type';
import type { TableRowData } from '../MyTable.tsx/type';
import styles from './MyStatisticModal.module.css';
interface MyStatisticModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    record?: TableRowData | null;
    questions?: Question[];
    surveyId?: string;
    title?: string;
    info?: string;
}

const MyStatisticModal: React.FC<MyStatisticModalProps> = ({ open, onOk, onCancel, record, questions, surveyId, title, info }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 当对话框打开或 record 改变时，设置表单初始值
    useEffect(() => {
        if (open && record && questions) {
            // 处理表单初始值，特别是多选题需要转换为数组
            const formValues: Record<string, string | string[] | undefined> = {};

            questions.forEach((question: Question) => {
                const { id, type } = question;
                const value = record[id];

                if (type === 'multi' && typeof value === 'string') {
                    // 多选题：将逗号分隔的字符串转换为数组
                    formValues[id] = value.split(', ').filter(Boolean);
                } else if (type === 'matrix_radio' && question.subTitles) {
                    // 矩阵题：处理每个子题目
                    question.subTitles.forEach((subTitle: SubTitle) => {
                        const fieldName = `${id}_${subTitle.id}`;
                        formValues[fieldName] = record[fieldName] as string | undefined;
                    });
                } else {
                    formValues[id] = value as string | undefined;
                }
            });

            form.setFieldsValue(formValues);
        }
    }, [open, record, questions, form]);

    // 将表单数据转换为提交格式
    const transformFormData = (values: Record<string, string | string[]>, questions?: Question[], record?: TableRowData | null, surveyId?: string, title?: string, info?: string): EditQuestionnaireData => {
        const answers: EditAnswer[] = questions?.map((question: Question) => {
            const { id, type, options, subTitles, required } = question;

            switch (type) {
                case 'text':
                case 'textarea':
                    return {
                        text: (values[id] as string) || '',
                        type: type,
                        title: null,
                        info: null,
                        id: id,
                        required: required
                    } as EditAnswer;

                case 'single':
                    // 根据选中的文本找到对应的option
                    const selectedText = values[id] as string;
                    const selectedOption = options?.find((opt: Option) => opt.text === selectedText);
                    return {
                        id: id,
                        type: 'single',
                        title: null,
                        info: null,
                        required: required,
                        options: selectedOption ? [{
                            text: selectedOption.text,
                            id: selectedOption.id
                        }] : []
                    } as EditAnswer;

                case 'multi':
                    // 多选：values[id] 是一个数组
                    const selectedTexts = (values[id] || []) as string[];
                    const selectedOptions = options?.filter((opt: Option) =>
                        selectedTexts.includes(opt.text)
                    ).map((opt: Option) => ({
                        text: opt.text,
                        id: opt.id
                    }));
                    return {
                        id: id,
                        type: 'multi',
                        title: null,
                        info: null,
                        required: required,
                        options: selectedOptions || []
                    } as EditAnswer;

                case 'matrix_radio':
                    // 矩阵题：为每个subTitle构建group
                    const groups = subTitles?.map((subTitle: SubTitle) => {
                        const fieldName = `${id}_${subTitle.id}`;
                        const selectedText = values[fieldName] as string;
                        const selectedOption = options?.find((opt: Option) => opt.text === selectedText);

                        return {
                            id: subTitle.id,
                            type: null,
                            title: null,
                            info: null,
                            required: false,
                            options: selectedOption ? [{
                                text: selectedOption.text,
                                id: selectedOption.id
                            }] : []
                        };
                    });

                    return {
                        id: id,
                        type: 'matrix_radio',
                        groups: groups || [],
                        subTitles: null,
                        title: null,
                        info: null,
                        required: required
                    } as EditAnswer;

                default:
                    return null as unknown as EditAnswer;
            }
        }).filter((answer): answer is EditAnswer => answer !== null) || []; // 过滤掉null值并确保类型

        // 构建完整的提交数据
        const finalId = record?.id || '';
        const finalSurveyId = record?.surveyId || surveyId || '';

        return {
            id: finalId,
            title: title || null,
            info: info || null,
            answers: answers,
            collectTime: record?.collectTime ? new Date(record.collectTime.replace(' ', 'T')).toISOString() : new Date().toISOString(),
            surveyId: finalSurveyId
        };
    };

    // 渲染表单项
    const renderFormItem = (question: Question) => {
        const { id, type, title, options, subTitles } = question;

        switch (type) {
            case 'text':
                return (
                    <Form.Item
                        key={id}
                        label={title}
                        name={id}
                        rules={[{ required: question.required, message: `请输入${title}` }]}
                    >
                        <Input placeholder={`请输入${title}`} />
                    </Form.Item>
                );

            case 'textarea':
                return (
                    <Form.Item
                        key={id}
                        label={title}
                        name={id}
                        rules={[{ required: question.required, message: `请输入${title}` }]}
                    >
                        <Input.TextArea rows={4} placeholder={`请输入${title}`} />
                    </Form.Item>
                );

            case 'single':
                return (
                    <Form.Item
                        key={id}
                        label={title}
                        name={id}
                        rules={[{ required: question.required, message: `请选择${title}` }]}
                    >
                        <Radio.Group>
                            {options?.map((option: Option) => (
                                <Radio key={option.id} value={option.text}>
                                    {option.text}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                );

            case 'multi':
                return (
                    <Form.Item
                        key={id}
                        label={title}
                        name={id}
                        rules={[{ required: question.required, message: `请选择${title}` }]}
                    >
                        <Checkbox.Group>
                            {options?.map((option: Option) => (
                                <Checkbox key={option.id} value={option.text}>
                                    {option.text}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                );

            case 'matrix_radio':
                // 矩阵单选题：为每个子题目创建一个单选组
                return (
                    <div key={id} style={{ marginBottom: '24px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>{title}</div>
                        {subTitles?.map((subTitle: SubTitle) => (
                            <Form.Item
                                key={`${id}_${subTitle.id}`}
                                label={subTitle.text}
                                name={`${id}_${subTitle.id}`}
                                rules={[{ required: question.required, message: `请选择${subTitle.text}` }]}
                            >
                                <Radio.Group>
                                    {options?.map((option: Option) => (
                                        <Radio key={option.id} value={option.text}>
                                            {option.text}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const submitData = transformFormData(values, questions, record, surveyId, title, info);
            console.log('表单提交的值（转换后）:', submitData);

            setLoading(true);
            await editQuestionnaireAnswer(submitData);
            console.log('编辑成功');
            message.success('编辑成功');
            form.resetFields();
            // 关闭对话框
            onOk(); // 通知父组件刷新数据并关闭对话框
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                // 表单验证失败，不关闭对话框，让用户继续编辑
                console.log('表单验证失败:', error);
                message.error('请检查表单填写是否完整');
            } else {
                // API调用失败，打印失败提示并关闭对话框
                console.error('编辑失败:', error);
                console.log('编辑失败');
                message.error('编辑失败，请重试');
                // 即使失败也关闭对话框
                onOk();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="修改答卷"
            className={styles.statisticModal}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            okText="确认"
            cancelText="取消"
            centered
            confirmLoading={loading}
            footer={(_, { OkBtn, CancelBtn }) => (
                <div style={{ textAlign: 'center' }}>
                    <Space>
                        <CancelBtn />
                        <OkBtn />
                    </Space>
                </div>
            )}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ maxHeight: '60vh', overflow: 'auto', padding: '10px' }}
            >
                {questions?.map(question => renderFormItem(question))}
            </Form>
        </Modal>
    );
};

export default MyStatisticModal;