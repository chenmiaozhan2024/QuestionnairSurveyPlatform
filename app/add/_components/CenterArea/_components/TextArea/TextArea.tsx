// import type {TextAreaItem} from './TextArea.ts'
import { Input } from 'antd';
import styles from './TextArea.module.css';  // 样式文件
import type { CSSProperties } from 'react' // 引入 React 样式类型
export interface TextAreaItem {
  style?: CSSProperties // 外层容器样式（可选）
  textareaStyle?: CSSProperties // 内部 TextArea 样式（可选）
  hasBorder?: boolean // 是否显示边框（可选，默认 true）
  value?: string // 输入框值（必填，通常是字符串）
  rows?: number // 行数（必填，数字类型）
  placeholder?: string // 占位文本（可选）
  className?: string // 额外类名（可选）
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea = ({style,textareaStyle,hasBorder = true,value,rows,placeholder,className,onChange,}:TextAreaItem) => {
    return (
        <div className={styles.textArea} style={style}>
            <Input.TextArea
                style={{ ...textareaStyle }}
                rows={rows}
                placeholder={placeholder}
                value={value}
                className={`${hasBorder ? styles.hasBorder : styles.noBorder} ${className || ''}`}
                onChange={onChange}
            />
        </div>
    );
};

export default TextArea;