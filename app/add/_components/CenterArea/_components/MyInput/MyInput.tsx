import React from 'react';
import { Input } from 'antd';
import styles from './MyInput.module.css'
// 定义 Props 类型
interface AppProps {
    placeholder?: string;
    type?: string; // 新增：接收一个 type 字符串参数
    value?: string; // 输入框的值
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 输入变化回调
}
// 使用 React.FC<AppProps> 或 (props: AppProps) 都可以
const MyInput: React.FC<AppProps> = ({ placeholder, type, value, onChange }) => {
    // 判断：如果 type 是 'QUESTION_TYPE_DESCRIPTION'，则不渲染任何内容
    if (type === 'QUESTION_TYPE_DESCRIPTION') {
        return null; // 不展示该组件
    }
    
    // 否则，正常渲染 Input 组件
    return (
        <div className={styles.myInputContainer}>
            <Input
                placeholder={placeholder || '请输入题目标题'}
                className={styles.myInput}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default MyInput;