import { useState } from 'react'
import styles from './CenterArea.module.css'
import TextArea from './_components/TextArea/TextArea'
import SpanText from './_components/SpanText/SpanText'
import MyInput from './_components/MyInput/MyInput'
import Option from './_components/Option/Option'
import { useSurveyStore } from '@/stores/question/questionStore'
import SvgIcon from '@/components/SvgIcon'
import type { SurveyQuestion } from '@/stores/question/type'
import MatrixTableStatic from './_components/MatrixTableStatic/MatrixTableStatic'
interface QuestionPropertyPanelProps{
  onQuestionClick:(question:SurveyQuestion)=>void
}
export default function CenterArea({onQuestionClick}:QuestionPropertyPanelProps) {
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
  const { questions } = useSurveyStore()

  const setTitle = useSurveyStore((s) => s.setTitle)
  // const 
  const handleTitleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value)
  }
  // 向仓库里存储问卷描述
  const setInfo=useSurveyStore((s)=>s.setInfo)
  const handleInfoChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfo(e.target.value)
  }
  const updateQuestion=useSurveyStore((s)=>s.updateQuestion)
  const addQuestion=useSurveyStore((s)=>s.addQuestion)
  const storeQuestions=useSurveyStore((s)=>s.questions)
  // handleDescriptionChange
  const handleDescriptionChange = (questionId: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.stopPropagation()
  updateQuestion(questionId, { info: e.target.value })
  }
  // 输入框的title（MyInput 用）
  const handleQuestionTitleInputChange = (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  e.stopPropagation()
  updateQuestion(questionId, { title: e.target.value })
  }
  // 文本域的title（TextArea 用，如段落描述）
  const handleQuestionTitleTextAreaChange = (questionId: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.stopPropagation()
  updateQuestion(questionId, { title: e.target.value })
}
  const [currentSelectedQuestionId, setCurrentSelectedQuestionId] = useState<string | null>(null)
  return (
    <div className={styles.centerArea}>
      <div className={styles.title}>
         <TextArea textareaStyle={{ height: '92px', }} placeholder={"请输入标题"}
          className={isTitle ? styles.titlePlaceholder : ''} onChange={handleTitleChange}>
         </TextArea>
      </div>
      <div className={styles.info}>
         {/* 问卷说明/介绍(选填) */}
      <TextArea textareaStyle={{ height: '92px', }} placeholder={"问卷说明/介绍(选填)"} onChange={handleInfoChange}></TextArea>
      </div>
      {questions.map((question, index) => {
        switch (question.type) {
          // 段落描述
          case 'QUESTION_TYPE_DESCRIPTION':
            return (
               <div
                key={question.id || index}
                className={`${styles.questionItem} ${styles.descriptionItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`}
                onClick={() => setCurrentSelectedQuestionId(question.id!)}
              >
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_DESCRIPTION}`} showIcon={question.required} />
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入段落描述"} value={question.title} onChange={handleQuestionTitleTextAreaChange(question.id!)} />
                </div>
            )
          // 单选
          case 'QUESTION_TYPE_SINGLE':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.singleItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_SINGLE}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_SINGLE"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入题目描述(选填)..."}  value={question.info} onChange={handleDescriptionChange(question.id!)}/>
                  {question.options?.map((option, index) => (
                    <Option
                      key={`${question.order || index}-${index}`}
                      modelValue={option}
                      optionIndex={index}
                      styleType="multi"
                       />))}
                <div className={styles.dibu}>
                  <div className={styles.add} onClick={(e) => {
                  e.stopPropagation();
                  const newOptions = [...(question.options || []), '']
                  const existsInStore = storeQuestions.some((q) => q.id === question.id)
                  if (existsInStore) {
                    updateQuestion(question.id!, { options: newOptions })
                  } else {
                    addQuestion({ ...question, options: newOptions })
                  }
                }}>
                  <SvgIcon name="tainjiaxuanxiang" width={"24"} height={"24"}></SvgIcon>
                    <span>添加</span></div>
                  <div className={styles.edit} style={{ cursor: 'pointer' }}>
                    <SvgIcon name="piliangguanlii" width={"24"} height={"24"}></SvgIcon>
                   <span>批量编辑</span>
                    </div>
                  </div>
              </div>
            )
          // 多选题
          case 'QUESTION_TYPE_MULTI':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.multiItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_MULTI}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_MULTI"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入题目描述(选填)"} value={question.info} onChange={handleDescriptionChange(question.id!)}/>
                {question.options?.map((option, idx) => (
                  <Option
                    key={`${question.order || index}-${idx}`}
                    modelValue={option}
                    optionIndex={idx}
                    styleType="multi"
                    onDelete={(optIndex) => {
                      const updatedOptions = [...(question.options || [])]
                      updatedOptions.splice(optIndex, 1)
                      updateQuestion(question.id!, { options: updatedOptions })
                    }}
                    onChange={(newValue) => {
                      const updatedOptions = [...(question.options || [])]
                      updatedOptions[idx] = newValue
                      updateQuestion(question.id!, { options: updatedOptions })
                    }}
                  />))}
                <div className={styles.dibu}>
                  <div className={styles.add} onClick={(e) => {
                  e.stopPropagation();
                  const newOptions = [...(question.options || []), '']
                  const existsInStore = storeQuestions.some((q) => q.id === question.id)
                  if (existsInStore) {
                    updateQuestion(question.id!, { options: newOptions })
                  } else {
                    addQuestion({ ...question, options: newOptions })
                  }
                }}>
                  <SvgIcon name="tainjiaxuanxiang" width={"24"} height={"24"}></SvgIcon>
                  <span>添加</span></div>
                  <div className={styles.edit} style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSelectedQuestionId(question.id!);
                }}>
                    <SvgIcon name="piliangguanlii" width={"24"} height={"24"}></SvgIcon>
                   <span>批量编辑</span>
                    </div>
                  </div>
              </div>
            )
          // 下拉
          case 'QUESTION_TYPE_SELECT':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.selectItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_SELECT}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_SELECT"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入题目描述(选填)"} value={question.info} onChange={handleDescriptionChange(question.id!)}/>
                {question.options?.map((option, idx) => (
                  <Option
                    key={`${question.order || index}-${idx}`}
                    modelValue={option}
                    optionIndex={idx}
                    styleType="multi"
                    onDelete={(optIndex) => {
                      const updatedOptions = [...(question.options || [])]
                      updatedOptions.splice(optIndex, 1)
                      updateQuestion(question.id!, { options: updatedOptions })
                    }}
                    onChange={(newValue) => {
                      const updatedOptions = [...(question.options || [])]
                      updatedOptions[idx] = newValue
                      updateQuestion(question.id!, { options: updatedOptions })
                    }}
                  />))}
                <div className={styles.dibu}>
                  <div className={styles.add} onClick={(e) => {
                  e.stopPropagation();
                  const newOptions = [...(question.options || []), '']
                  const existsInStore = storeQuestions.some((q) => q.id === question.id)
                  if (existsInStore) {
                    updateQuestion(question.id!, { options: newOptions })
                  } else {
                    addQuestion({ ...question, options: newOptions })
                  }
                }}>
                  <SvgIcon name="tainjiaxuanxiang" width={"24"} height={"24"}></SvgIcon>
                  <span>添加</span></div>
                  <div className={styles.edit} style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSelectedQuestionId(question.id!);
                }}>
                    <SvgIcon name="piliangguanlii" width={"24"} height={"24"}></SvgIcon>
                   <span>批量编辑</span>
                    </div>
                  </div>
              </div>
            )
          // 单行文本
          case 'QUESTION_TYPE_TEXT':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.textItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_TEXT}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_TEXT"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '46px' }} placeholder={"题目说明/描述(选填)"} value={question.info} onChange={handleDescriptionChange(question.id!)}/>
              </div>
            )
          // 多行文本
          case 'QUESTION_TYPE_TEXTAREA':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.textareaItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_TEXTAREA}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_TEXTAREA"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '46px' }} placeholder={"题目说明/描述(选填)"} value={question.info} onChange={handleDescriptionChange(question.id!)}/>
              </div>
            )
          // 矩形单选
          case 'QUESTION_TYPE_MATRIX_RADIO':
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.matrixItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`${index + 1}--${COMPONENT_TYPE_INFO.QUESTION_TYPE_MATRIX_RADIO}`} showIcon={question.required} />
                <MyInput type={"QUESTION_TYPE_MATRIX_RADIO"} value={question.title} onChange={handleQuestionTitleInputChange(question.id!)}/>
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入题目描述(选填)"} value={question.info} onChange={handleDescriptionChange(question.id!)}/>
                <MatrixTableStatic question={question}></MatrixTableStatic>
              </div>
            )
          default:
            return (
              <div key={question.id || index} className={`${styles.questionItem} ${styles.defaultItem} ${currentSelectedQuestionId === question.id ? styles.selected : ''}`} onClick={() => setCurrentSelectedQuestionId(question.id!)}>
                <SpanText text={`未知类型问题 ${index + 1}`} />
                <TextArea textareaStyle={{ height: '92px' }} placeholder={"请输入题目标题"} value={question.title || ''} onChange={handleQuestionTitleTextAreaChange(question.id!)}/>
              </div>
            )
        }
      })}
    </div>
  )
}
