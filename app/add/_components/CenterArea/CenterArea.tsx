import { useState } from 'react'
import styles from './CenterArea.module.css'
import TextArea from './_components/TextArea/TextArea'
import SpanText from './_components/SpanText/SpanText'
import MyInput from './_components/MyInput/MyInput'
import Option from './_components/Option/Option'
export default function CenterArea() {
  // 控制是否是标题
  const [isTitle, setIsTitle] = useState<boolean>(true)
  const COMPONENT_TYPE_INFO = {
    QUESTION_TYPE_DESCRIPTION: '段落描述',
    QUESTION_TYPE_SINGLE: '单选',
    QUESTION_TYPE_MULTI: '多选',
    QUESTION_TYPE_SELECT: '下拉',
    QUESTION_TYPE_TEXT: '单行文本',
    QUESTION_TYPE_TEXTAREA: '多行文本',
    QUESTION_TYPE_MATRIX_RADIO: '矩形单选',
  }
  return (
    <div className={styles.centerArea}>
      <TextArea textareaStyle={{ height: '92px', }} placeholder={"请输入标题"}
        className={isTitle ? styles.titlePlaceholder : ''}>
        
      </TextArea>
      {/* 问卷说明/介绍(选填) */}
      <TextArea textareaStyle={{ height: '92px', }} placeholder={"问卷说明/介绍(选填)"}></TextArea>
      {/* 段落描述 */}
      <SpanText text={`${1 + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_DESCRIPTION}`} showIcon={true}></SpanText>
       <TextArea textareaStyle={{ height: '92px', }} placeholder={"请输入段落描述"}></TextArea>
      {/* 单选 */}
      <SpanText text={`${1 + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_SINGLE}`} showIcon={true}></SpanText>
      <MyInput type={"QUESTION_TYPE_SINGLE"} />
      <TextArea textareaStyle={{ height: '92px', }} placeholder={"请输入题目描述"}></TextArea>
      <div>
        <Option modelValue="" optionIndex={0} />
         <Option modelValue="" optionIndex={1} />
      </div>
      
    </div>
  )
}
