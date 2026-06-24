import styles from './SpanText.module.css';
import React  from "react";
// import type {SpanTextType} from './SpanText.ts'
import SvgIcon from '@/components/SvgIcon'
export interface SpanTextType {
    text: string;
    showIcon?: boolean;
}
const SpanText:React.FC<SpanTextType> = ({ text,showIcon=false }) => {
    return (
      <div className={styles.spanTextContainer}>
          <span className={styles.spanText}>{text}</span>
          {showIcon && ( // 只有 showIcon 为 true 时才渲染图标
              <SvgIcon
                  name="xinghao"
                  width={"24"}
                  height={"24"}
                  className={styles.xinghao}
              />
          )}
        </div>
    );
};

export default SpanText;