import React, { useEffect, useRef } from 'react';
import styles from './MatrixTableStatic.module.css';
import SvgIcon from "@/components/SvgIcon";
import { Question } from '@/services/statistics/type';

interface MatrixTableStaticProps {
    question: Question; // 题目数据
    onBatchEditOptions?: (question: Question) => void; // 批量编辑选项回调函数
    onBatchEditSubTitles?: (question: Question) => void; // 批量编辑题目回调函数
}

const MatrixTableStatic: React.FC<MatrixTableStaticProps> = ({ question, onBatchEditOptions, onBatchEditSubTitles }) => {
    const tableWrapperRef = useRef<HTMLDivElement>(null);

    // 从 question 中获取选项和子标题
    const options = question.options || [];
    const subTitles = question.subTitles || [];

    // 添加选项（列）
    const handleAddOption = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newOptions = [...options, ''];
    };

    // 添加题目（行）
    const handleAddSubTitle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newSubTitles = [...subTitles, ''];
    };

    // 删除选项（列）
    const handleDeleteOption = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newOptions = options.filter((_, i: number) => i !== index);
    };

    // 删除题目（行）
    const handleDeleteSubTitle = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newSubTitles = subTitles.filter((_, i: number) => i !== index);
    };

    // 更新选项
    const handleOptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        e.stopPropagation();
        const newOptions = [...options];
        newOptions[index] = e.target.value;
        // 自动调整高度
        autoResizeTextarea(e.target);
    };

    // 自动调整 textarea 高度的函数
    const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
        // 重置高度以获取正确的 scrollHeight
        textarea.style.height = 'auto';
        // 设置新高度，加上一些边距
        const newHeight = Math.max(28, textarea.scrollHeight); // 最小高度 28px
        textarea.style.height = `${newHeight}px`;
    };

    // 初始化时调整所有 textarea 的高度
    useEffect(() => {
        if (tableWrapperRef.current) {
            const textareas = tableWrapperRef.current.querySelectorAll<HTMLTextAreaElement>('.t-input-auto-resize');
            textareas.forEach((textarea) => {
                autoResizeTextarea(textarea);
            });
        }
    }, [subTitles, options]); // 当 subTitles 或 options 变化时重新调整

    // 更新题目
    const handleSubTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        e.stopPropagation();
        const newSubTitles = [...subTitles];
        newSubTitles[index] = e.target.value;
        // 自动调整高度
        autoResizeTextarea(e.target);
    };

    return (
        <div>
            {/* 表格部分 */}
            <div className="matrix-table-wrapper" ref={tableWrapperRef}>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        {options.map((option, index) => (
                            <th key={index} className="th-option">
                                <textarea
                                    rows={1}
                                    placeholder="输入选项"
                                    className="t-input t-input-auto-resize"
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(e, index)}
                                    style={{ minHeight: '28px', overflow: 'hidden' }}
                                />
                                {/* 删除按钮 */}
                                <SvgIcon
                                    name="delete"
                                    width={"24"}
                                    height={"24"}
                                    onClick={(e) => handleDeleteOption(e, index)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {subTitles.map((subTitle, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="td-title">
                                <textarea
                                    rows={1}
                                    placeholder="输入标题"
                                    className="t-input t-input-auto-resize"
                                    value={subTitle.text}
                                    onChange={(e) => handleSubTitleChange(e, rowIndex)}
                                    style={{ minHeight: '28px', overflow: 'hidden' }}
                                />
                                <SvgIcon
                                    name="delete"
                                    width={"24"}
                                    height={"24"}
                                    onClick={(e) => handleDeleteSubTitle(e, rowIndex)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                            {/* 对应每个选项，显示一个圆形占位 */}
                            {options.map((_, colIndex) => (
                                <td key={colIndex} className="td-circle"></td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 配置按钮区域 */}
            <div className="config">
                <div className="add-btn flex-center hover-light" onClick={handleAddOption}>
                    <SvgIcon name="tainjiaxuanxiang" width={"24"} height={"24"}></SvgIcon>
                    <span className="text-padding">添加选项</span>
                </div>
                <div 
                    className="add-btn flex-center hover-light" 
                    onClick={(e) => {
                        e.stopPropagation();
                        // 触发批量编辑选项功能
                        if (onBatchEditOptions) {
                            onBatchEditOptions(question);
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {/*<span className="svg">📝</span>*/}
                    <SvgIcon name="piliangguanlii" width={"24"} height={"24"}></SvgIcon>
                    <span className="text-padding">批量编辑选项</span>
                </div>
                <div className="add-btn flex-center hover-light" onClick={handleAddSubTitle}>
                    <SvgIcon name="tainjiaxuanxiang" width={"24"} height={"24"}></SvgIcon>
                    <span className="text-padding">添加题目</span>
                </div>
                <div 
                    className="add-btn flex-center hover-light"
                    onClick={(e) => {
                        e.stopPropagation();
                        // 触发批量编辑题目功能
                        if (onBatchEditSubTitles) {
                            onBatchEditSubTitles(question);
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <SvgIcon name="piliangguanlii" width={"24"} height={"24"}></SvgIcon>
                    <span className="text-padding">批量编辑题目</span>
                </div>
            </div>
        </div>
    );
};

export default MatrixTableStatic;