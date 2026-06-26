import React, { useMemo } from 'react';
import { Table, Button, Space} from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
// import './MyTable.scss'
import type { MyTableProps, TableRowData } from './type';
import type { Answer, Question, SubTitle, SurveyDataItem } from '@/services/statistics/type';
import css from 'styled-jsx/css';

const useStyle = createStyles(({ css, prefixCls }) => {
    return {
        customTable: css`
      .${prefixCls}-table {
        .${prefixCls}-table-container {
          .${prefixCls}-table-body,
          .${prefixCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }

        .${prefixCls}-table-thead > tr > th {
          white-space: normal !important;
          word-break: break-word;
          line-height: 1.5;
          padding: 12px 8px;
          text-align: center;
          border-right: 1px solid #f0f0f0;
        }

        .${prefixCls}-table-tbody > tr > td {
          white-space: normal !important;
          word-break: break-word;
          line-height: 1.5;
          text-align: center;
          border-right: 1px solid #f0f0f0;
        }
      }
    `,
    };
});

// 表格数据接口已在 index.ts 中定义为 TableRowData

/**
 * 格式化时间
 * @param timeInput 时间输入（可能是字符串、数组或其他格式）
 * @returns 格式化后的时间字符串
 */
const formatDateTime = (timeInput: string | number[] | any): string => {
    try {
        let date: Date;
        
        // 处理数组格式的时间，如 [2020, 6, 23, 10, 20]
        if (Array.isArray(timeInput)) {
            const [year, month, day, hours = 0, minutes = 0, seconds = 0] = timeInput;
            date = new Date(year, month - 1, day, hours, minutes, seconds); // month 需要减1
        } else if (typeof timeInput === 'string') {
            // 处理字符串格式
            date = new Date(timeInput);
        } else if (timeInput instanceof Date) {
            // 如果已经是 Date 对象
            date = timeInput;
        } else {
            // 其他情况，返回当前时间
            date = new Date();
        }
        
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            console.warn('无效的日期格式:', timeInput);
            return '未知时间';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error('时间格式化失败:', error, timeInput);
        return '未知时间';
    }
};

/**
 * 从答案列表生成表格列配置
 * @param answers 答案数组（通常取第一条数据作为模板）
 * @param questions 题目列表
 * @param onEdit 编辑按钮点击回调
 * @param onDelete 删除按钮点击回调
 * @param userRole 用户角色
 * @returns 表格列配置
 */
const generateColumns = (
    answers: Answer[],
    questions: Question[],
    onEdit?: (record: TableRowData) => void,
    onDelete?: (record: TableRowData) => void,
    userRole?: number | string | null
): TableColumnsType<TableRowData> => {
    if (!answers || answers.length === 0) return [];
    // console.log('userRole111',userRole)
    const columns: TableColumnsType<TableRowData> = [];

    // 添加序号列作为第一列
    columns.push({
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
        fixed: 'left',
        align: 'center',
    });

    // 添加提交时间列作为第二列
    columns.push({
        title: '提交时间',
        dataIndex: 'collectTime',
        key: 'collectTime',
        width: 150,
        fixed: 'left',
        align: 'center',
        ellipsis: true,
    });

    let columnIndex = 0;

    answers.forEach((answer) => {
        const { id, type, title } = answer;

        // 从 questions 中查找对应的题目标题
        const question = questions.find(q => q.id === id);
        const columnTitle = question?.title || title || `问题 ${columnIndex + 1}`;

        switch (type) {
            case 'text':
            case 'textarea':
                // 文本类型：创建一列
                columns.push({
                    title: columnTitle,
                    dataIndex: id,
                    key: id,
                    width: 150,
                    align: 'center',
                    ellipsis: {
                        showTitle: true,
                    },
                });
                columnIndex++;
                break;

            case 'single':
                // 单选题：创建一列
                columns.push({
                    title: columnTitle,
                    dataIndex: id,
                    key: id,
                    width: 150,
                    align: 'center',
                    ellipsis: {
                        showTitle: true,
                    },
                });
                columnIndex++;
                break;

            case 'multi':
                // 多选题：创建一列（显示所有选中的选项，用逗号分隔）
                // 题目内容在一行显示，超出部分显示省略号
                columns.push({
                    title: columnTitle,
                    dataIndex: id,
                    key: id,
                    width: 250,
                    align: 'center',
                    ellipsis: {
                        showTitle: true,
                    },
                });
                columnIndex++;
                break;

            case 'matrix_radio':
                // 矩阵题：根据题目的 subTitles 创建列
                // 题目可能较长，超过250px需要换行
                if (question?.subTitles && Array.isArray(question.subTitles) && question.subTitles.length > 0) {
                    question.subTitles.forEach((subTitle: SubTitle) => {
                        columns.push({
                            title: subTitle.text || `${columnTitle} - ${columnIndex + 1}`,
                            dataIndex: `${id}_${subTitle.id}`,
                            key: `${id}_${subTitle.id}`,
                            width: 250,
                            align: 'center',
                            ellipsis: {
                                showTitle: true,
                            },
                        });
                        columnIndex++;
                    });
                } else if (answer.groups && answer.groups.length > 0) {
                    // 降级处理：如果没有 subTitles，使用 answer.groups
                    answer.groups.forEach((group, groupIndex) => {
                        columns.push({
                            title: `${columnTitle} - ${groupIndex + 1}`,
                            dataIndex: `${id}_${group.id}`,
                            key: `${id}_${group.id}`,
                            width: 250,
                            align: 'center',
                            ellipsis: {
                                showTitle: true,
                            },
                        });
                        columnIndex++;
                    });
                }
                break;

            default:
                // 其他未知类型
                columns.push({
                    title: columnTitle,
                    dataIndex: id,
                    key: id,
                    width: 150,
                    align: 'center',
                    ellipsis: {
                        showTitle: true,
                    },
                });
                columnIndex++;
                break;
        }
    });

    // 固定第一个题目列（索引2，因为索引0是序号，索引1是提交时间）
    if (columns.length > 2) {
        columns[2].fixed = 'left';
    }

    // 只有超级管理员（userRole 为字符串 "0" 或数字 0）才显示操作列
    // 兼容字符串和数字类型
    const isSuperAdmin = userRole === "0" || userRole === 0;
    if (isSuperAdmin) {
        columns.push({
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            if (onEdit) {
                                onEdit(record);
                            }
                        }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => {
                            if (onDelete) {
                                onDelete(record);
                            }
                        }}
                    >
                        删除
                    </Button>
                </Space>
            ),
        });
    }

    return columns;
};

/**
 * 从答案数据生成表格行数据
 * @param tableData 完整的表格数据（包含 collectTime）
 * @param questions 题目列表
 * @returns 表格数据源
 */
const generateDataSource = (tableData: SurveyDataItem[], questions: Question[]): TableRowData[] => {
    if (!tableData || tableData.length === 0) return [];

    return tableData.map((item, rowIndex) => {
        const row: TableRowData = {
            key: rowIndex,
            index: rowIndex + 1, // 添加序号，从1开始
            collectTime: formatDateTime(item.collectTime), // 添加格式化后的提交时间
            id: item.id, // 保存原始 id
            surveyId: item.surveyId, // 保存 surveyId
        };

        const answers = item.answers;
        answers.forEach((answer: Answer) => {
            const { id, type } = answer;

            // 查找对应的题目
            const question = questions.find(q => q.id === id);

            switch (type) {
                case 'text':
                case 'textarea':
                    // 文本类型：直接取 text 字段
                    row[id] = answer.text || '';
                    break;

                case 'single':
                    // 单选题：取 options[0].text
                    row[id] = answer.options?.[0]?.text || '';
                    break;

                case 'multi':
                    // 多选题：取所有选中的选项，用逗号分隔
                    row[id] = answer.options?.map(opt => opt.text).join(', ') || '';
                    break;

                case 'matrix_radio':
                    // 矩阵题：根据题目的 subTitles 生成数据
                    if (question?.subTitles && Array.isArray(question.subTitles) && question.subTitles.length > 0) {
                        question.subTitles.forEach((subTitle: SubTitle) => {
                            // 在 answer.groups 中查找对应的 group
                            const group = answer.groups?.find(g => g.id === subTitle.id);
                            row[`${id}_${subTitle.id}`] = group?.options?.[0]?.text || '';
                        });
                    } else if (answer.groups && answer.groups.length > 0) {
                        // 降级处理：如果没有 subTitles，使用 answer.groups
                        answer.groups.forEach((group) => {
                            row[`${id}_${group.id}`] = group.options?.[0]?.text || '';
                        });
                    }
                    break;

                default:
                    row[id] = '';
                    break;
            }
        });

        return row;
    });
};

// 主组件
const App: React.FC<MyTableProps> = ({tableData, questions, onEdit, onDelete, userRole}) => {
    const { styles } = useStyle();

    // 提取所有用户的答案列表
    const answersList = useMemo(() => {
        return tableData.map((item) => item.answers);
    }, [tableData]);

    // 生成表格列配置（使用第一条数据作为模板）
    const columns = useMemo(() => {
        if (answersList.length === 0) return [];
        return generateColumns(answersList[0], questions, onEdit, onDelete, userRole);
    }, [answersList, questions, onEdit, onDelete, userRole]);

    // 生成表格数据源
    const dataSource = useMemo(() => {
        return generateDataSource(tableData, questions);
    }, [tableData, questions]);

    // console.log('生成的列配置:', columns);
    // console.log('生成的数据源:', dataSource);

    // 如果没有数据，显示空状态
    if (tableData.length === 0) {
        return (
            <div className="table-container" style={{ textAlign: 'center', padding: '50px' }}>
                暂无数据
            </div>
        );
    }

    return (
        <div className={"table-container"}>
            <Table<TableRowData>
                className={styles.customTable}
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 'max-content', y: 'calc(100vh - 450px)' }}
                style={{ minWidth: '100%' }}
            />
        </div>
    );
};

export default App;