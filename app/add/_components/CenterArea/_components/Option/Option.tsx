import SvgIcon from '@/components/SvgIcon'
import styles from './Option.module.css'
const QUESTION_TYPE_MULTI = 'multi'; // 假设这是多选题类型的常量
import type { CSSProperties } from 'react'; // 引入React的CSSProperties类型
export interface OptionItem {
    style?: CSSProperties; // style通常是React的CSSProperties类型，可选
    modelValue: string; // 输入框的值，假设是字符串类型
    optionIndex: number; // 选项索引，假设是数字
    styleType?: string; // 样式类型，可选，默认是multi
    onDelete?: (index: number) => void; // 删除回调函数类型
    onChange?: (value: string) => void; // 输入变化回调函数类型
}
const Option = ({style,modelValue,optionIndex,styleType = QUESTION_TYPE_MULTI,onDelete, onChange }:OptionItem) => {
    const handleDelete = (e: React.MouseEvent) => {
        // console.log(1)
        console.log(optionIndex)
        e.stopPropagation(); // 阻止事件冒泡到题目容器
        if (onDelete) {
            onDelete(optionIndex); // 传递当前选项的索引给父组件
        }

    };
    // 处理选项文本修改
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value) 
        }
    };


    return (

        <div className={styles.option} style={style}>
            <input type="text" className={styles.input} value={modelValue} onChange={handleInputChange}  placeholder="点击输入"/>
            <span className={`${styles.optionSpan} ${styleType === QUESTION_TYPE_MULTI ? 'checkbox' : ''}`}></span>
            {/*<SvgIcon name="delete" className="del svg"/>*/}
            {/*<span className="del svg" onClick={handleDelete}> </span>*/}
            <SvgIcon name="delete" className={styles.delsvg} onClick={handleDelete}/>
            <span className={styles.border} ></span>
            {/*<div className="add">添加</div>*/}
            {/*<div className="edit">批量删除</div>*/}
        </div>
    );
};

export default Option;